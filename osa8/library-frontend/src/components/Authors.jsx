import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { ALL_AUTHORS, EDIT_AUTHOR } from "../queries";

const Authors = ({ show }) => {
  const result = useQuery(ALL_AUTHORS, { skip: !show });

  const [name, setName] = useState("");
  const [born, setBorn] = useState("");

  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
    awaitRefetchQueries: true,
    onError: (error) => {
      console.log(error);
    },
  });

  if (!show) return null;
  if (result.loading) return <div>loading...</div>;
  if (result.error) return <div>error: {result.error.message}</div>;

  const authors = result.data.allAuthors;

  // asetetaan oletusvalinta kun data on ladattu ja name on tyhjä
  if (!name && authors.length > 0) {
    setName(authors[0].name);
  }

  const submit = async (event) => {
    event.preventDefault();

    await editAuthor({
      variables: {
        name,
        setBornTo: Number(born),
      },
    });

    setBorn("");
  };

  return (
    <div>
      <h2>authors</h2>

      <table>
        <thead>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
        </thead>
        <tbody>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born ?? ""}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Set birthyear</h3>

      <form onSubmit={submit}>
        <div>
          name{" "}
          <select value={name} onChange={(e) => setName(e.target.value)}>
            {authors.map((a) => (
              <option key={a.name} value={a.name}>
                {a.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          born{" "}
          <input
            type="number"
            value={born}
            onChange={(e) => setBorn(e.target.value)}
          />
        </div>

        <button type="submit">update author</button>
      </form>
    </div>
  );
};

export default Authors;
