import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import { ApolloProvider } from "@apollo/client/react";
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { SetContextLink } from "@apollo/client/link/context";

const authLink = new SetContextLink(({ headers }) => {
  const token = localStorage.getItem("library-user-token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : null,
    },
  };
});

const httpLink = new HttpLink({
  uri: "http://localhost:4000",
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink),
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
);
