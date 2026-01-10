const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const middleware = require("../utils/middleware");

// GET /api/blogs (no token required)

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", {
    username: 1,
    name: 1,
  });

  response.json(blogs);
});

// POST /api/blogs (token required)

blogsRouter.post("/", middleware.userExtractor, async (request, response) => {
  const body = request.body;
  const user = request.user;

  // Validation

  if (!body || !body.title || !body.url) {
    return response.status(400).json({ error: "title and url are required" });
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes ?? 0,
    user: user._id,
  });

  const savedBlog = await blog.save();

  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  response.status(201).json(savedBlog);
});

// DELETE /api/blogs/:id (token required)

blogsRouter.delete(
  "/:id",
  middleware.userExtractor,
  async (request, response) => {
    const user = request.user;

    const blog = await Blog.findById(request.params.id);

    if (!blog) {
      return response.status(404).end();
    }

    // Only the creator of the blog can delete it
    if (blog.user.toString() !== user._id.toString()) {
      return response
        .status(401)
        .json({ error: "only creator can delete blog" });
    }

    await Blog.findByIdAndDelete(blog._id);

    // Remove blog reference from user's blogs array
    user.blogs = user.blogs.filter((b) => b.toString() !== blog._id.toString());
    await user.save();

    response.status(204).end();
  }
);

// PUT /api/blogs/:id (update likes)

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
