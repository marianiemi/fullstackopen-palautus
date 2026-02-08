export enum Gender {
  Male = "male",
  Female = "female",
  Other = "other",
}

export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  ssn: string;
  gender: Gender;
  occupation: string;
  entries: unknown[];
}

export type NewPatient = Omit<Patient, "id" | "entries">;
export type NonSensitivePatient = Omit<Patient, "ssn">;
