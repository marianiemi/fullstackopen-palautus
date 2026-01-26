const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { v1: uuid } = require("uuid");

let authors = [
  { name: "Robert Martin", born: 1952, id: "1" },
  { name: "Martin Fowler", born: 1963, id: "2" },
  { name: "Fyodor Dostoevsky", born: 1821, id: "3" },
  { name: "Joshua Kerievsky", born: null, id: "4" },
  { name: "Sandi Metz", born: null, id: "5" },
];

let books = [
  {
    title: "Clean Code",
    published: 2008,
    author: "Robert Martin",
    genres: ["refactoring"],
  },
  {
    title: "Agile software development",
    published: 2002,
    author: "Robert Martin",
    genres: ["agile", "patterns", "design"],
  },
  {
    title: "Refactoring",
    published: 1999,
    author: "Martin Fowler",
    genres: ["refactoring"],
  },
  {
    title: "Crime and punishment",
    published: 1866,
    author: "Fyodor Dostoevsky",
    genres: ["classic", "crime"],
  },
  {
    title: "The Idiot",
    published: 1869,
    author: "Fyodor Dostoevsky",
    genres: ["classic"],
  },
  {
    title: "When to use patterns",
    published: 2004,
    author: "Joshua Kerievsky",
    genres: ["patterns"],
  },
  {
    title: "Practical Object-Oriented Design",
    published: 2012,
    author: "Sandi Metz",
    genres: ["design"],
  },
];

const typeDefs = /* GraphQL */ `
  type Book {
    title: String!
    published: Int!
    author: String!
    genres: [String!]!
  }

  type Author {
    name: String!
    born: Int
    bookCount: Int!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book

    editAuthor(name: String!, setBornTo: Int!): Author
  }
`;

const resolvers = {
  Query: {
    bookCount: () => books.length,
    authorCount: () => authors.length,

    allBooks: (root, args) => {
      return books.filter((b) => {
        const matchesAuthor = !args.author || b.author === args.author;
        const matchesGenre = !args.genre || b.genres.includes(args.genre);
        return matchesAuthor && matchesGenre;
      });
    },

    allAuthors: () => authors,
  },

  Author: {
    bookCount: (root) => books.filter((b) => b.author === root.name).length,
  },

  Mutation: {
    addBook: (root, args) => {
      // 1) lisää kirja
      const newBook = {
        title: args.title,
        author: args.author,
        published: args.published,
        genres: args.genres,
      };

      books = books.concat(newBook);

      // 2) jos kirjailijaa ei ole, lisää kirjailija
      const existingAuthor = authors.find((a) => a.name === args.author);
      if (!existingAuthor) {
        const newAuthor = {
          name: args.author,
          born: null,
          id: uuid(),
        };
        authors = authors.concat(newAuthor);
      }

      return newBook;
    },

    editAuthor: (root, args) => {
      const author = authors.find((a) => a.name === args.name);
      if (!author) {
        return null;
      }

      const updatedAuthor = {
        ...author,
        born: args.setBornTo,
      };

      authors = authors.map((a) => (a.name === args.name ? updatedAuthor : a));

      return updatedAuthor;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
