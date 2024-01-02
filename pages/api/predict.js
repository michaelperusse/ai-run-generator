import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export default async (req, res) => {
  try {
    const { imageDescription } = req.body;
    let prediction = await replicate.predictions.create(
      {
        version: "39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
        input: {
          prompt: imageDescription,
          width: 1120 / 2,
          height: 1488 / 2,
        }
      }
    );

    console.log(prediction);

    // Use Replicate's built-in wait method
    prediction = await replicate.wait(prediction);

    console.log(prediction.output);

    res.status(200).json(prediction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.toString() });
  }
};