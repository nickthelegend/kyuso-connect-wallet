import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { senderAddr, receiverAddr, amount, oauthToken } = req.body;
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_SIGN_URL || 'http://127.0.0.1:3000'}/sign-txn`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ senderAddr, receiverAddr, amount, oauthToken })
    });
    
    const result = await response.json();
    res.json(result);
  } catch (error) {
    console.error('Proxy sign error:', error);
    res.status(500).json({ error: 'Proxy sign failed', details: error.message });
  }
}