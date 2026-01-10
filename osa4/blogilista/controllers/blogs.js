// Blog routes

const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

// Get all blogs

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

// Add a new blog

blogsRouter.post("/", async (request, response) => {
  const body = request.body;

  // Validation
  if (!body.title || !body.url) {
    return response.status(400).json({ error: "title and url are required" });
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes ?? 0,
  });

  const savedBlog = await blog.save();
  response.status(201).json(savedBlog);
});

// Delete a blog

blogsRouter.delete("/:id", async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id);
  response.status(204).end();
});

// Update a blog

blogsRouter.put("/:id", async (request, response) => {
  const body = request.body;

  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    { likes: body.likes },
    { new: true, runValidators: true, context: "query" }
  );

  if (!updatedBlog) {
    return response.status(404).end();
  }

  response.json(updatedBlog);
});

module.exports = blogsRouter;
