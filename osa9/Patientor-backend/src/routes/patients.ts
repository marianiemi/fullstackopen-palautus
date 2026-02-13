import express, { NextFunction, Request, Response } from "express";
import patientService from "../services/patientService";
import toNewPatient from "../utils";

const router = express.Router();

router.get("/", (_req, res) => {
  res.json(patientService.getNonSensitivePatients());
});

router.post("/", (req: Request, res: Response, next: NextFunction) => {
  try {
    const newPatient = toNewPatient(req.body);
    const added = patientService.addPatient(newPatient);
    res.status(201).json(added);
  } catch (error: unknown) {
    next(error);
  }
});

export default router;
