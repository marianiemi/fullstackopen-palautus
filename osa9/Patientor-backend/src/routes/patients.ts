import express, { NextFunction, Request, Response } from "express";
import patientService from "../services/patientService";
import toNewPatient from "../utils";

const router = express.Router();

router.get("/", (_req: Request, res: Response) => {
  res.json(patientService.getNonSensitivePatients());
});

router.get("/:id", (req: Request<{ id: string }>, res: Response) => {
  const patient = patientService.getPatientById(req.params.id);

  if (!patient) {
    res.status(404).json({ error: "patient not found" });
    return;
  }

  res.json(patient);
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
