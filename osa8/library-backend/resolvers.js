const Book = require("./models/book");
const Author = require("./models/author");
const User = require("./models/user");

const jwt = require("jsonwebtoken");
const { GraphQLError } = require("graphql");

const { PubSub } = require("graphql-subscriptions");
const pubsub = new PubSub();

const handleMongooseError = (error, invalidArgs) => {
  if (error.name === "ValidationError") {
    throw new GraphQLError(error.message, {
      extensions: {
        code: "BAD_USER_INPUT",
        invalidArgs,
        error,
      },
    });
  }

  if (error.name === "MongoServerError" && error.code === 11000) {
    const fields = Object.keys(error.keyValue || {});
    const field = fields[0] || "field";
    const value = error.keyValue ? error.keyValue[field] : undefined;

    throw new GraphQLError(
      `${field} must be unique${value ? `: ${value}` : ""}`,
      {
        extensions: {
          code: "BAD_USER_INPUT",
          invalidArgs,
          error,
        },
      },
    );
  }

  throw new GraphQLError("Saving failed", {
    extensions: {
      code: "BAD_USER_INPUT",
      invalidArgs,
      error,
    },
  });
};

const requireAuth = (currentUser) => {
  if (!currentUser) {
    throw new GraphQLError("not authenticated", {
      extensions: { code: "UNAUTHENTICATED" },
    });
  }
};

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),

    allBooks: async (root, args) => {
      const filter = {};

      if (args.genre) {
        filter.genres = { $in: [args.genre] };
      }

      if (args.author) {
        const author = await Author.findOne({ name: args.author });
        if (!author) return [];
        filter.author = author._id;
      }

      return Book.find(filter).populate("author");
    },

    allAuthors: async () => Author.find({}),

    me: (root, args, context) => context.currentUser,
  },

  Author: {
    bookCount: async (root) => Book.countDocuments({ author: root._id }),
  },

  Mutation: {
    addBook: async (root, args, context) => {
      requireAuth(context.currentUser);

      let author = await Author.findOne({ name: args.author });

      if (!author) {
        author = new Author({ name: args.author, born: null });
        try {
          await author.save();
        } catch (error) {
          handleMongooseError(error, args.author);
        }
      }

      const book = new Book({
        title: args.title,
        published: args.published,
        author: author._id,
        genres: args.genres,
      });

      try {
        await book.save();
      } catch (error) {
        handleMongooseError(error, args.title);
      }

      const populatedBook = await Book.findById(book._id).populate("author");

      pubsub.publish("BOOK_ADDED", { bookAdded: populatedBook });

      return populatedBook;
    },

    editAuthor: async (root, args, context) => {
      requireAuth(context.currentUser);

      const author = await Author.findOne({ name: args.name });
      if (!author) return null;

      author.born = args.setBornTo;

      try {
        await author.save();
      } catch (error) {
        handleMongooseError(error, args.name);
      }

      return author;
    },

    createUser: async (root, args) => {
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre,
      });

      try {
        await user.save();
      } catch (error) {
        handleMongooseError(error, args.username);
      }

      return user;
    },

    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });

      if (!user || args.password !== "secret") {
        throw new GraphQLError("wrong credentials", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) };
    },
  },

  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterableIterator("BOOK_ADDED"),
    },
  },
};

module.exports = resolvers;
