import axios from "axios";
import { useEffect, useState } from "react";
import type { NonSensitiveDiaryEntry, NewDiaryEntry } from "./types";
import diaryService from "./services/diaryService";

const App = () => {
  const [diaries, setDiaries] = useState<NonSensitiveDiaryEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [date, setDate] = useState("");
  const [weather, setWeather] = useState("");
  const [visibility, setVisibility] = useState("");
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
      weather,
      visibility,
      comment,
    };

    try {
      const added = await diaryService.create(newEntry);

      // Päivitä listaan non-sensitive (id/date/weather/visibility)
      const nonSensitiveAdded: NonSensitiveDiaryEntry = {
        id: (added as any).id,
        date: (added as any).date,
        weather: (added as any).weather,
        visibility: (added as any).visibility,
      };

      setDiaries(diaries.concat(nonSensitiveAdded));

      setDate("");
      setWeather("");
      setVisibility("");
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
          <input
            value={visibility}
            onChange={(e) => setVisibility(e.target.value)}
          />
        </div>

        <div>
          weather{" "}
          <input value={weather} onChange={(e) => setWeather(e.target.value)} />
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
