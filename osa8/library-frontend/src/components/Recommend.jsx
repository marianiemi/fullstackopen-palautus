import { useQuery } from "@apollo/client/react";
import { ALL_BOOKS, ME } from "../queries";

const Recommend = ({ show }) => {
  const meResult = useQuery(ME, { skip: !show });

  const favoriteGenre = meResult.data?.me?.favoriteGenre ?? null;

  const booksResult = useQuery(ALL_BOOKS, {
    variables: { genre: favoriteGenre },
    skip: !show || !favoriteGenre,
  });

  if (!show) return null;
  if (meResult.loading) return <div>loading...</div>;
  if (meResult.error) return <div>error: {meResult.error.message}</div>;

  if (!favoriteGenre) return <div>no favorite genre set</div>;

  if (booksResult.loading) return <div>loading...</div>;
  if (booksResult.error) return <div>error: {booksResult.error.message}</div>;

  const books = booksResult.data?.allBooks ?? [];

  return (
    <div>
      <h2>Recommendations</h2>

      <div>
        Books in your favorite genre <b>{favoriteGenre}</b>
      </div>

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
    </div>
  );
};

export default Recommend;
