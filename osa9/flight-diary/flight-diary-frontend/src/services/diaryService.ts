import axios from "axios";
import type { NonSensitiveDiaryEntry } from "../types";

const baseUrl = "http://localhost:3000/api/diaries";

const getAll = async (): Promise<NonSensitiveDiaryEntry[]> => {
  const response = await axios.get<NonSensitiveDiaryEntry[]>(baseUrl);
  return response.data;
};

export default {
  getAll,
};
