import { z } from "zod";
import { Gender, NewPatient } from "./types";

export const NewPatientSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    dateOfBirth: z.string().date("Invalid date format (YYYY-MM-DD)"),
    ssn: z.string().min(1, "SSN is required"),
    gender: z.nativeEnum(Gender),
    occupation: z.string().min(1, "Occupation is required"),
  })
  .strict();

const toNewPatient = (object: unknown): NewPatient => {
  return NewPatientSchema.parse(object);
};

export default toNewPatient;
