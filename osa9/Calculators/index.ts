import express, { Request, Response } from "express";
import { calculateBmi } from "./bmiCalculator";
import { calculateExercises } from "./exerciseCalculator";

const app = express();
app.use(express.json());

app.get("/hello", (_req: Request, res: Response) => {
  res.send("Hello Full Stack!");
});

const parseQueryNumber = (value: unknown): number => {
  if (typeof value !== "string" || isNaN(Number(value))) {
    throw new Error("malformatted parameters");
  }
  return Number(value);
};

app.get("/bmi", (req: Request, res: Response) => {
  try {
    const height = parseQueryNumber(req.query.height);
    const weight = parseQueryNumber(req.query.weight);

    const bmi = calculateBmi(height, weight);

    res.json({ weight, height, bmi });
  } catch {
    res.status(400).json({ error: "malformatted parameters" });
  }
});

const toNumber = (value: unknown): number => {
  if (typeof value === "number") {
    if (isNaN(value)) throw new Error("malformatted parameters");
    return value;
  }

  if (
    typeof value === "string" &&
    value.trim() !== "" &&
    !isNaN(Number(value))
  ) {
    return Number(value);
  }

  throw new Error("malformatted parameters");
};

const toNumberArray = (value: unknown): number[] => {
  if (!Array.isArray(value)) throw new Error("malformatted parameters");
  return value.map((v) => toNumber(v));
};

app.post("/exercises", (req: Request, res: Response) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const body = req.body;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const dailyExercises = body?.daily_exercises as unknown;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const target = body?.target as unknown;

  if (dailyExercises === undefined || target === undefined) {
    return res.status(400).json({ error: "parameters missing" });
  }

  try {
    const dailyHours = toNumberArray(dailyExercises);
    const targetNumber = toNumber(target);

    if (dailyHours.length === 0) {
      return res.status(400).json({ error: "malformatted parameters" });
    }

    const result = calculateExercises(dailyHours, targetNumber);
    return res.json(result);
  } catch {
    return res.status(400).json({ error: "malformatted parameters" });
  }
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
