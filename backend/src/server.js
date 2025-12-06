import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';
import { Buffer } from 'buffer';

const app = express();
const PORT = process.env.PORT || 3000;

// Configure multer for file uploads
const upload = multer({
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
      cb(new Error('Only audio files are allowed'));
    }
  }
});

// Configure CORS to allow frontend on port 5173
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

// Initialize ElevenLabs client
let elevenlabsClient = null;

if (process.env.ELEVENLABS_API_KEY) {
  try {
    elevenlabsClient = new ElevenLabsClient({
      apiKey: process.env.ELEVENLABS_API_KEY
    });
    console.log('✅ ElevenLabs client initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize ElevenLabs client:', error.message);
  }
} else {
  console.warn('⚠️  ELEVENLABS_API_KEY not found in environment variables');
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Love\'s Legacy Backend is running',
    elevenlabsClientInitialized: !!elevenlabsClient,
    apiKeyConfigured: !!process.env.ELEVENLABS_API_KEY,
    timestamp: new Date().toISOString()
  });
});

// Speech-to-text endpoint
app.post('/api/speech-to-text', upload.single('audio'), async (req, res) => {
  try {
    if (!elevenlabsClient) {
      return res.status(500).json({
        error: 'ElevenLabs client not initialized. Please check API key configuration.'
      });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No audio file provided' });
    }

    console.log(`🎤 Processing audio file: ${req.file.originalname} (${req.file.size} bytes)`);

    // Convert buffer to readable stream for ElevenLabs
    const audioBuffer = req.file.buffer;

    // Use ElevenLabs speech-to-text API
    const transcription = await elevenlabsClient.speechToText.convert({
      file: audioBuffer,
      model_id: 'scribe_v1', // ElevenLabs speech-to-text model
      tag_audio_events: true, // Enable audio event tagging
      language_code: 'en', // Default to English, can be made configurable
      timestamps_granularity: 'word' // Get word-level timestamps
    });

    console.log('✅ Transcription completed');

    res.json({
      success: true,
      transcription: transcription.text,
      metadata: {
        language: transcription.language_code,
        duration: transcription.duration,
        word_count: transcription.text.split(' ').length
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Speech-to-text error:', error);

    // Handle specific ElevenLabs errors
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        error: 'ElevenLabs API error',
        message: error.message,
        statusCode: error.statusCode
      });
    }

    res.status(500).json({
      error: 'Failed to transcribe audio',
      message: error.message
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);

  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 25MB.' });
    }
  }

  res.status(500).json({
    error: 'An unexpected error occurred',
    message: error.message
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Love's Legacy Backend server running on http://localhost:${PORT}`);
  console.log(`💚 Health check: http://localhost:${PORT}/health`);
  console.log(`🎤 Speech-to-text: POST http://localhost:${PORT}/api/speech-to-text`);
  console.log(`📡 CORS enabled for frontend: http://localhost:5173`);
});
