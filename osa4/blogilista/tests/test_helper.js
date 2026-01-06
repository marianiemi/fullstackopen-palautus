const Blog = require("../models/blog");

const initialBlogs = [
  {
    title: "First blog",
    author: "Alice",
    url: "https://example.com/1",
    likes: 1,
  },
  {
    title: "Second blog",
    author: "Bob",
    url: "https://example.com/2",
    likes: 2,
  },
];

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((b) => b.toJSON());
};

module.exports = {
  initialBlogs,
  blogsInDb,
};
