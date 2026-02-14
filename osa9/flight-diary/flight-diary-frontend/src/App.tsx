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

  const addDiary = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    const newEntry: NewDiaryEntry = {
      date,
      weather,
      visibility,
      comment,
    };

    try {
      const added = await diaryService.create(newEntry);

      // Backend palauttaa todennäköisesti myös commentin, mutta listassa käytetään NonSensitiveä.
      // Päivitetään lista lisäämällä uusi entry ja pudottamalla comment pois varmuuden vuoksi:
      const nonSensitiveAdded: NonSensitiveDiaryEntry = {
        id: (added as any).id ?? Number((added as any).id),
        date: (added as any).date,
        weather: (added as any).weather,
        visibility: (added as any).visibility,
      };

      setDiaries(diaries.concat(nonSensitiveAdded));

      setDate("");
      setWeather("");
      setVisibility("");
      setComment("");
    } catch {
      setError("Failed to add diary entry");
    }
  };

  return (
    <div>
      <h1>Flight Diaries</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <h2>Add new entry</h2>

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
          weather{" "}
          <input
            value={weather}
            onChange={(e) => setWeather(e.target.value)}
            placeholder="e.g. sunny"
          />
        </div>

        <div>
          visibility{" "}
          <input
            value={visibility}
            onChange={(e) => setVisibility(e.target.value)}
            placeholder="e.g. great"
          />
        </div>

        <div>
          comment{" "}
          <input value={comment} onChange={(e) => setComment(e.target.value)} />
        </div>

        <button type="submit">add</button>
      </form>

      <h2>Entries</h2>

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
