// Imports
const express = require("express");
const mongoose = require("mongoose");

const config = require("./utils/config");
const logger = require("./utils/logger");
const middleware = require("./utils/middleware");
const blogsRouter = require("./controllers/blogs");

// App initialization
const app = express();

// Database connection
logger.info("connecting to", config.MONGODB_URI);

mongoose
  .connect(config.MONGODB_URI, { family: 4 })
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((error) => {
    logger.error("error connecting to MongoDB:", error.message);
  });

// Middleware
app.use(express.json());
app.use(middleware.requestLogger);

// Routes
app.use("/api/blogs", blogsRouter);

// Error handling
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

// Export app
module.exports = app;
