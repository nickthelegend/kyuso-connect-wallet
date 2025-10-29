export default async function handler(req: any, res: any) {
  const body = req.body;
  const BACKEND_SIGN_URL = process.env.BACKEND_SIGN_URL || "http://127.0.0.1:3000/sign";
  
  try {
    const r = await fetch(BACKEND_SIGN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    const j = await r.json();
    res.status(r.status).json(j);
  } catch (error) {
    res.status(500).json({ error: "Failed to proxy to backend" });
  }
}