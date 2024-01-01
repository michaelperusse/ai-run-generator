// pages/api/predict.js
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export default async (req, res) => {
  try {
    const { imageDescription } = req.body;
    let prediction = await replicate.deployments.predictions.create(
      "michaelperusse",
      "fake-strava-run",
      {
        input: {
          prompt: imageDescription,
          width: 768,
          height: 768,
        }
      }
    );
    res.status(200).json(prediction);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
};