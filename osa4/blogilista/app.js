const express = require("express");
const mongoose = require("mongoose");
const blogsRouter = require("./controllers/blogs");

const app = express();

mongoose.connect(process.env.MONGODB_URI, { family: 4 });

app.use(express.json());
app.use("/api/blogs", blogsRouter);

module.exports = app;
