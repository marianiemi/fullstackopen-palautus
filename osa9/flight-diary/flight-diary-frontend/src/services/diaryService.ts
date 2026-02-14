import axios from "axios";
import type { NonSensitiveDiaryEntry, NewDiaryEntry } from "../types";

const baseUrl = "http://localhost:3000/api/diaries";

const getAll = async (): Promise<NonSensitiveDiaryEntry[]> => {
  const response = await axios.get<NonSensitiveDiaryEntry[]>(baseUrl);
  return response.data;
};

const create = async (
  entry: NewDiaryEntry,
): Promise<NonSensitiveDiaryEntry> => {
  const response = await axios.post<NonSensitiveDiaryEntry>(baseUrl, entry);
  return response.data;
};

export default {
  getAll,
  create,
};
