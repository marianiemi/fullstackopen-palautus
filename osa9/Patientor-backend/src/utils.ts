import { Gender, NewPatient } from "./types";

const isString = (text: unknown): text is string => {
  return typeof text === "string" || text instanceof String;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const parseStringField = (value: unknown, fieldName: string): string => {
  if (!isString(value) || value.trim().length === 0) {
    throw new Error(`Incorrect or missing ${fieldName}`);
  }
  return value.trim();
};

const parseDateOfBirth = (value: unknown): string => {
  if (!isString(value) || !isDate(value)) {
    throw new Error(`Incorrect or missing dateOfBirth: ${String(value)}`);
  }
  return value;
};

const isGender = (param: string): param is Gender => {
  return (Object.values(Gender) as string[]).includes(param);
};

const parseGender = (value: unknown): Gender => {
  if (!isString(value) || !isGender(value)) {
    throw new Error(`Incorrect or missing gender: ${String(value)}`);
  }
  return value;
};

const toNewPatient = (object: unknown): NewPatient => {
  if (!object || typeof object !== "object") {
    throw new Error("Incorrect or missing data");
  }

  const obj = object as Record<string, unknown>;

  const newPatient: NewPatient = {
    name: parseStringField(obj.name, "name"),
    dateOfBirth: parseDateOfBirth(obj.dateOfBirth),
    ssn: parseStringField(obj.ssn, "ssn"),
    gender: parseGender(obj.gender),
    occupation: parseStringField(obj.occupation, "occupation"),
  };

  return newPatient;
};

export default toNewPatient;
