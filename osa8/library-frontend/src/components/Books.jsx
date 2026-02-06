import { useMemo, useState } from "react";
import { useQuery } from "@apollo/client/react";
import { ALL_BOOKS } from "../queries";

const Books = ({ show }) => {
  const [genre, setGenre] = useState(null);

  // hakee kaikki kirjat (näytetään genre-painikkeissa ja haetaan suodatettuihin kirjoihin)
  const allResult = useQuery(ALL_BOOKS, {
    variables: { genre: null },
    skip: !show,
  });

  // hakee kirjat valitulla genrellä
  const filteredResult = useQuery(ALL_BOOKS, {
    variables: { genre },
    skip: !show,
  });

  const allBooks = allResult.data?.allBooks ?? [];
  const books = filteredResult.data?.allBooks ?? [];

  const genres = useMemo(() => {
    const all = allBooks.flatMap((b) => b.genres);
    return Array.from(new Set(all)).sort();
  }, [allBooks]);

  if (!show) return null;
  if (allResult.loading || filteredResult.loading) return <div>loading...</div>;
  if (allResult.error) return <div>error: {allResult.error.message}</div>;
  if (filteredResult.error)
    return <div>error: {filteredResult.error.message}</div>;

  return (
    <div>
      <h2>books</h2>

      {genre ? (
        <div>
          in genre <b>{genre}</b>
        </div>
      ) : (
        <div>in all genres</div>
      )}

      <table>
        <thead>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
        </thead>
        <tbody>
          {books.map((b) => (
            <tr key={b.id ?? b.title}>
              <td>{b.title}</td>
              <td>{b.author?.name ?? ""}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: 12 }}>
        {genres.map((g) => (
          <button
            key={g}
            onClick={() => setGenre(g)}
            style={{ marginRight: 6 }}
          >
            {g}
          </button>
        ))}
        <button onClick={() => setGenre(null)}>all genres</button>
      </div>
    </div>
  );
};

export default Books;
