import express from "express";
import cors from "cors";
import { z } from "zod";
import diagnosesRouter from "./routes/diagnoses";
import patientsRouter from "./routes/patients";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/ping", (_req, res) => {
  res.send("pong");
});

app.use("/api/diagnoses", diagnosesRouter);
app.use("/api/patients", patientsRouter);

// error handler
app.use(
  (
    error: unknown,
    _req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ): void => {
    if (error instanceof z.ZodError) {
      res.status(400).send({ error: error.issues });
      return;
    }

    if (error instanceof Error) {
      res.status(400).send({ error: error.message });
      return;
    }

    next(error);
  },
);
export default app;
