import axios from "axios";
import { useEffect, useState } from "react";
import diaryService from "./services/diaryService";
import type {
  DiaryEntry,
  NewDiaryEntry,
  NonSensitiveDiaryEntry,
  Visibility,
  Weather,
} from "./types";

const visibilityOptions: Visibility[] = ["great", "good", "ok", "poor"];
const weatherOptions: Weather[] = [
  "sunny",
  "rainy",
  "cloudy",
  "stormy",
  "windy",
];

const App = () => {
  const [diaries, setDiaries] = useState<NonSensitiveDiaryEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [date, setDate] = useState("");
  const [visibility, setVisibility] = useState<Visibility>("good");
  const [weather, setWeather] = useState<Weather>("sunny");
  const [comment, setComment] = useState("");

  useEffect(() => {
    const fetchDiaries = async () => {
      try {
        const data = await diaryService.getAll();
        setDiaries(data);
      } catch {
        setError("Failed to fetch diaries");
      }
    };

    fetchDiaries();
  }, []);

  const notifyError = (message: string) => {
    setError(message);
    setTimeout(() => setError(null), 5000);
  };

  const addDiary = async (event: React.FormEvent) => {
    event.preventDefault();

    const newEntry: NewDiaryEntry = {
      date,
      visibility,
      weather,
      comment,
    };

    try {
      const added: DiaryEntry = await diaryService.create(newEntry);

      const nonSensitiveAdded: NonSensitiveDiaryEntry = {
        id: added.id,
        date: added.date,
        visibility: added.visibility,
        weather: added.weather,
      };

      setDiaries(diaries.concat(nonSensitiveAdded));

      setDate("");
      setVisibility("good");
      setWeather("sunny");
      setComment("");
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        const backendMessage = e.response?.data;
        if (typeof backendMessage === "string") {
          notifyError(`Error: ${backendMessage}`);
          return;
        }
      }
      notifyError("Error: diary creation failed");
    }
  };

  return (
    <div>
      <h1>Flight Diaries</h1>

      <h2>Add new entry</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={addDiary}>
        <div>
          date{" "}
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div>
          visibility{" "}
          {visibilityOptions.map((v) => (
            <label key={v} style={{ marginRight: 8 }}>
              <input
                type="radio"
                name="visibility"
                value={v}
                checked={visibility === v}
                onChange={() => setVisibility(v)}
              />
              {v}
            </label>
          ))}
        </div>

        <div>
          weather{" "}
          {weatherOptions.map((w) => (
            <label key={w} style={{ marginRight: 8 }}>
              <input
                type="radio"
                name="weather"
                value={w}
                checked={weather === w}
                onChange={() => setWeather(w)}
              />
              {w}
            </label>
          ))}
        </div>

        <div>
          comment{" "}
          <input value={comment} onChange={(e) => setComment(e.target.value)} />
        </div>

        <button type="submit">add</button>
      </form>

      <h2>Diary entries</h2>

      {diaries.map((d) => (
        <div key={d.id}>
          <h3>{d.date}</h3>
          <div>visibility: {d.visibility}</div>
          <div>weather: {d.weather}</div>
        </div>
      ))}
    </div>
  );
};

export default App;
