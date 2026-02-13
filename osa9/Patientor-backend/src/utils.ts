import { z } from "zod";
import { Gender, NewPatient } from "./types";

export const NewPatientSchema = z
  .object({
    name: z.string().min(1),
    dateOfBirth: z.string().date(),
    ssn: z.string().min(1),
    gender: z.nativeEnum(Gender),
    occupation: z.string().min(1),
  })
  .strict();

const toNewPatient = (object: unknown): NewPatient => {
  return NewPatientSchema.parse(object);
};

export default toNewPatient;
