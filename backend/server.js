import express from "express";
import axios from "axios";
import * as algosdk from "algosdk";

const app = express();

app.use((req, res, next) => {
  if (req.method === 'POST') {
    let data = '';
    req.on('data', chunk => {
      data += chunk.toString();
    });
    req.on('end', () => {
      try {
        req.body = JSON.parse(data || '{}');
        next();
      } catch (err) {
        res.status(400).json({ error: 'Invalid JSON' });
      }
    });
  } else {
    next();
  }
});

const VAULT_ADDR = "http://127.0.0.1:8200";
const VAULT_TOKEN = "root";
const algodClient = new algosdk.Algodv2('', 'https://testnet-api.algonode.cloud', '');

function verifyOAuthToken(token) {
  return { uid: "123" };
}

app.post("/sign", async (req, res) => {
  const { txn, oauthToken } = req.body;
  const user = verifyOAuthToken(oauthToken);
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = Buffer.from(txn, "base64").toString();
    const txnObj = JSON.parse(decoded).txn;

    let txnInstance = null;
    if (typeof algosdk.instantiateTxnIfNeeded === "function") {
      txnInstance = algosdk.instantiateTxnIfNeeded(txnObj);
    } else if (algosdk.transaction && typeof algosdk.transaction.instantiateTxnIfNeeded === "function") {
      txnInstance = algosdk.transaction.instantiateTxnIfNeeded(txnObj);
    } else if (algosdk.Transaction && typeof algosdk.Transaction.from_obj_for_encoding === "function") {
      txnInstance = algosdk.Transaction.from_obj_for_encoding(txnObj);
    } else if (typeof algosdk.Transaction === "function") {
      txnInstance = new algosdk.Transaction(txnObj);
    } else {
      throw new Error("Unable to construct Transaction: algosdk API shape not recognized");
    }

    if (typeof txnInstance.bytesToSign !== "function") {
      throw new Error("Transaction instance does not have bytesToSign()");
    }
    const bytesToSign = txnInstance.bytesToSign();

    const payload = { input: Buffer.from(bytesToSign).toString("base64") };
    const response = await axios.post(
      `${VAULT_ADDR}/v1/transit/sign/algo-user-${user.uid}`,
      payload,
      { headers: { "X-Vault-Token": VAULT_TOKEN } }
    );

    const vaultSig = response.data?.data?.signature;
    if (!vaultSig) throw new Error("No signature returned from Vault");

    const sigBase64 = vaultSig.split(":").pop();
    const sigBytes = Buffer.from(sigBase64, "base64");

    if (typeof txnInstance.attachSignature === "function") {
      const signedTxnBytes = txnInstance.attachSignature(txnInstance.from, new Uint8Array(sigBytes));
      
      if (typeof algosdk.verifyBytes === "function") {
        try {
          const ok = algosdk.verifyBytes(bytesToSign, new Uint8Array(sigBytes), txnInstance.from);
          if (!ok) console.warn("Local signature verification failed");
        } catch (e) {
          console.warn("verifyBytes check threw:", e.message || e);
        }
      }

      const txnResult = await algodClient.sendRawTransaction(signedTxnBytes).do();
      res.json({
        txId: txnResult.txId,
        signedBytesBase64: Buffer.from(signedTxnBytes).toString("base64"),
      });
    } else if (typeof algosdk.encodeObj === "function") {
      const signedTxnObj = { 
        txn: txnInstance.get_obj_for_encoding ? txnInstance.get_obj_for_encoding() : txnObj, 
        sig: sigBytes 
      };
      const signedBytes = algosdk.encodeObj(signedTxnObj);
      const txnResult = await algodClient.sendRawTransaction(signedBytes).do();
      res.json({
        txId: txnResult.txId,
        signedBytesBase64: Buffer.from(signedBytes).toString("base64"),
      });
    } else {
      throw new Error("No method available to attach signature");
    }
  } catch (err) {
    console.error("Signing failed:", err.response?.data || err.message || err);
    res.status(500).json({ 
      error: "Signing failed", 
      details: (err.response?.data || err.message || err).toString() 
    });
  }
});

app.listen(3000, () => {
  console.log("Backend server running on http://127.0.0.1:3000");
});