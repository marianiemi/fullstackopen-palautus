import { useEffect, useState } from "react";
import type { NonSensitiveDiaryEntry } from "./types";
import diaryService from "./services/diaryService";

const App = () => {
  const [diaries, setDiaries] = useState<NonSensitiveDiaryEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDiaries = async () => {
      try {
        const data = await diaryService.getAll();
        setDiaries(data);
      } catch (e) {
        setError("Failed to fetch diaries");
      }
    };

    fetchDiaries();
  }, []);

  return (
    <div>
      <h1>Flight Diaries</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {diaries.map((d) => (
        <div key={d.id}>
          <h3>{d.date}</h3>
          <div>weather: {d.weather}</div>
          <div>visibility: {d.visibility}</div>
        </div>
      ))}
    </div>
  );
};

export default App;
