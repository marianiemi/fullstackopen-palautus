import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BlogForm from "./BlogForm";

test("calls createBlog with correct details when a new blog is created", async () => {
  const createBlog = vi.fn();
  const user = userEvent.setup();

  render(<BlogForm createBlog={createBlog} />);

  const titleInput = screen.getByLabelText("title");
  const authorInput = screen.getByLabelText("author");
  const urlInput = screen.getByLabelText("url");

  await user.type(titleInput, "Testing title");
  await user.type(authorInput, "Testing author");
  await user.type(urlInput, "https://testing.url");

  const createButton = screen.getByText("create");
  await user.click(createButton);

  expect(createBlog).toHaveBeenCalledTimes(1);
  expect(createBlog.mock.calls[0][0]).toEqual({
    title: "Testing title",
    author: "Testing author",
    url: "https://testing.url",
  });
});
