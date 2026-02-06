import { ALL_BOOKS } from "../queries";

export const addBookToCache = (cache, bookToAdd) => {
  cache.updateQuery(
    { query: ALL_BOOKS, variables: { genre: null } },
    (data) => {
      if (!data) return { allBooks: [bookToAdd] };

      const exists = data.allBooks.some((b) => b.id === bookToAdd.id);
      if (exists) return data;

      return { allBooks: data.allBooks.concat(bookToAdd) };
    },
  );
};
