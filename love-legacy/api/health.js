export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const elevenlabsClientInitialized = !!(process.env.ELEVENLABS_API_KEY && process.env.ELEVENLABS_API_KEY !== 'your_api_key_here');
  const apiKeyConfigured = !!process.env.ELEVENLABS_API_KEY;

  res.status(200).json({
    status: 'ok',
    message: 'Love\'s Legacy API is running',
    elevenlabsClientInitialized,
    apiKeyConfigured,
    timestamp: new Date().toISOString(),
    platform: 'vercel'
  });
}
