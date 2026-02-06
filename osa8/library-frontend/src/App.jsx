import { useState } from "react";
import { useApolloClient, useSubscription } from "@apollo/client/react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import LoginForm from "./components/LoginForm";
import Recommend from "./components/Recommend";
import { ALL_BOOKS, BOOK_ADDED } from "./queries";

const App = () => {
  const [page, setPage] = useState("authors");
  const [token, setToken] = useState(
    localStorage.getItem("library-user-token"),
  );

  const client = useApolloClient();

  const logout = () => {
    setToken(null);
    localStorage.removeItem("library-user-token");
    client.resetStore();
    setPage("authors");
  };

  // 8.24 + 8.25: tilaa uudet kirjat + ilmoitus + pidä lista ajantasalla
  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      const addedBook = data.data.bookAdded;

      window.alert(
        `New book added: ${addedBook.title} by ${addedBook.author.name}`,
      );

      // Päivitä välimuisti: ALL_BOOKS(genre: null) listaan lisäys, jos ei jo ole siellä
      client.cache.updateQuery(
        { query: ALL_BOOKS, variables: { genre: null } },
        (cached) => {
          const existing = cached?.allBooks ?? [];
          const alreadyInCache = existing.some((b) => b.id === addedBook.id);

          if (alreadyInCache) {
            return cached;
          }

          return {
            allBooks: existing.concat(addedBook),
          };
        },
      );
    },
  });

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>Authors</button>
        <button onClick={() => setPage("books")}>Books</button>

        {!token ? (
          <button onClick={() => setPage("login")}>Login</button>
        ) : (
          <>
            <button onClick={() => setPage("add")}>Add book</button>
            <button onClick={() => setPage("recommend")}>Recommend</button>
            <button onClick={logout}>Logout</button>
          </>
        )}
      </div>

      <Authors show={page === "authors"} token={token} />
      <Books show={page === "books"} />
      <Recommend show={page === "recommend"} />

      <NewBook show={page === "add"} setPage={setPage} />

      <LoginForm
        show={page === "login"}
        setToken={setToken}
        setPage={setPage}
      />
    </div>
  );
};

export default App;
