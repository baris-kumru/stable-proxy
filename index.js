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

  const formData = new FormData();
  formData.append('prompt', prompt);
  formData.append('aspect_ratio', '1:1');
  formData.append('output_format', 'png');

  try {
    const response = await axios.post(
      'https://api.stability.ai/v2beta/stable-image/generate/core',
      formData,
      {
        headers: {
          Authorization: `Bearer ${STABILITY_API_KEY}`,
          ...formData.getHeaders()
        },
        responseType: 'arraybuffer'
      }
    );

    const base64Image = Buffer.from(response.data).toString('base64');
    res.json({ image: `data:image/png;base64,${base64Image}` });
  } catch (error) {
    console.error('API error:', error?.response?.data || error.message);
    res.status(500).json({ error: 'Image generation failed.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
