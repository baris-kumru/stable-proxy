import express from 'express';
import axios from 'axios';
import cors from 'cors';
import FormData from 'form-data';

const app = express();
const PORT = process.env.PORT || 3000;
const STABILITY_API_KEY = process.env.STABILITY_API_KEY;

app.use(cors());
app.use(express.json());

app.post('/generate', async (req, res) => {
  const { prompt } = req.body;

  try {
    const form = new FormData();
    form.append('prompt', prompt);
    form.append('aspect_ratio', '1:1');
    form.append('output_format', 'png');

    const response = await axios.post(
      'https://api.stability.ai/v2beta/stable-image/generate/core',
      form,
      {
        headers: {
          ...form.getHeaders(),
          Authorization: `Bearer ${STABILITY_API_KEY}`,
          Accept: 'application/json',
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
