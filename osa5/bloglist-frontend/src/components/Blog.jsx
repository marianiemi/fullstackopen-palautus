import { useState } from "react";

const Blog = ({ blog, user, handleLike, handleDelete }) => {
  const [visible, setVisible] = useState(false);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  const detailsStyle = { display: visible ? "" : "none" };

  // blog.user voi olla joko objekti (populate) tai pelkkä id-string
  const blogUserId = blog.user?.id || blog.user?._id || blog.user;
  const loggedUserId = user?.id || user?._id;

  const blogUsername = blog.user?.username;
  const loggedUsername = user?.username;

  const showDelete =
    (blogUserId &&
      loggedUserId &&
      String(blogUserId) === String(loggedUserId)) ||
    (blogUsername && loggedUsername && blogUsername === loggedUsername);

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}{" "}
        <button onClick={toggleVisibility}>{visible ? "hide" : "view"}</button>
      </div>

      <div style={detailsStyle}>
        <div>{blog.url}</div>
        <div>
          likes {blog.likes} <button onClick={handleLike}>like</button>
        </div>
        <div>{blog.user?.name}</div>

        {showDelete && <button onClick={handleDelete}>delete</button>}
      </div>
    </div>
  );
};

export default Blog;
