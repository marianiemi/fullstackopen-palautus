import diaryData from "../../data/entries";
import type {
  DiaryEntry,
  NewDiaryEntry,
  NonSensitiveDiaryEntry,
} from "../types";

const diaries: DiaryEntry[] = diaryData;

const getEntries = (): NonSensitiveDiaryEntry[] => {
  return diaries.map(({ id, date, weather, visibility }) => ({
    id,
    date,
    weather,
    visibility,
  }));
};

const findById = (id: number): DiaryEntry | undefined => {
  return diaries.find((d) => d.id === id);
};

const addDiary = (entry: NewDiaryEntry): DiaryEntry => {
  const newId =
    diaries.length > 0 ? Math.max(...diaries.map((d) => d.id)) + 1 : 1;

  const newDiaryEntry: DiaryEntry = {
    id: newId,
    ...entry,
  };

  diaries.push(newDiaryEntry);
  return newDiaryEntry;
};

export default {
  getEntries,
  getNonSensitiveEntries: getEntries,
  addDiary,
  findById,
};
