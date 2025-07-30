import express from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

// API anahtarını doğrudan buraya yazıyoruz:
const STABILITY_API_KEY = 'sk-qq80OXO7gOHGlcKtkbx09GE8iqlR6eNlRcdrxHDIBBcDChfx';

app.use(cors());
app.use(express.json());

app.post('/generate', async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await axios.post(
      'https://api.stability.ai/v2beta/stable-image/generate/core',
      {
        prompt,
        output_format: 'png',
        aspect_ratio: '1:1'
      },
      {
        headers: {
          Authorization: `Bearer ${STABILITY_API_KEY}`,
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      }
    );

    res.json({ image: response.data.image });
  } catch (error) {
    console.error('API error:', error?.response?.data || error.message);
    res.status(500).json({ error: 'Image generation failed.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
