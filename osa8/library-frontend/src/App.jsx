import { useState } from "react";
import { useApolloClient } from "@apollo/client/react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import LoginForm from "./components/LoginForm";
import Recommend from "./components/Recommend";

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
            <button onClick={logout}>Logout</button>
            <button onClick={() => setPage("recommend")}>recommend</button>
          </>
        )}
      </div>

      <Authors show={page === "authors"} token={token} />
      <Books show={page === "books"} />
      <Recommend show={page === "recommend"} />

      <NewBook show={page === "add"} />

      <LoginForm
        show={page === "login"}
        setToken={setToken}
        setPage={setPage}
      />
    </div>
  );
};

export default App;
