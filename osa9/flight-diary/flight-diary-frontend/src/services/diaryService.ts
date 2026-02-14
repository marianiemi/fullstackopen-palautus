import axios from "axios";
import type {
  DiaryEntry,
  NewDiaryEntry,
  NonSensitiveDiaryEntry,
} from "../types";

const baseUrl = "http://localhost:3000/api/diaries";

const getAll = async (): Promise<NonSensitiveDiaryEntry[]> => {
  const response = await axios.get<NonSensitiveDiaryEntry[]>(baseUrl);
  return response.data;
};

const create = async (entry: NewDiaryEntry): Promise<DiaryEntry> => {
  const response = await axios.post<DiaryEntry>(baseUrl, entry);
  return response.data;
};

export default {
  getAll,
  create,
};
