const { test, describe } = require("node:test");
const assert = require("node:assert");

const listHelper = require("../utils/list_helper");
const { blogs } = require("./blogs_test_data");

describe("favoriteBlog", () => {
  test("returns the blog with most likes", () => {
    const result = listHelper.favoriteBlog(blogs);

    console.log("favoriteBlog result:", result);

    assert.deepStrictEqual(result, {
      _id: "5a422b3a1b54a676234d17f9",
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
      __v: 0,
    });
  });

  test("of empty list is null", () => {
    const result = listHelper.favoriteBlog([]);
    assert.strictEqual(result, null);
  });
});

describe("mostBlogs", () => {
  test("returns author with most blogs", () => {
    const result = listHelper.mostBlogs(blogs);

    console.log("mostBlogs result:", result);

    assert.deepStrictEqual(result, {
      author: "Robert C. Martin",
      blogs: 3,
    });
  });

  test("of empty list is null", () => {
    const result = listHelper.mostBlogs([]);
    assert.strictEqual(result, null);
  });
});

describe("mostLikes", () => {
  test("returns author with most likes and like sum", () => {
    const result = listHelper.mostLikes(blogs);

    console.log("mostLikes result:", result);

    assert.deepStrictEqual(result, {
      author: "Edsger W. Dijkstra",
      likes: 17,
    });
  });

  test("of empty list is null", () => {
    const result = listHelper.mostLikes([]);
    assert.strictEqual(result, null);
  });
});
