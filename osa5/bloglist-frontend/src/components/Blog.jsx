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

  // delete näkyy vain omistajalle (id tai username)
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
      {/* OLETUSNÄKYMÄ: title + author + view/hide */}
      <div>
        {blog.title} {blog.author}{" "}
        <button onClick={toggleVisibility}>{visible ? "hide" : "view"}</button>
      </div>

      {/* YKSITYISKOHDAT: url + likes + user + delete */}
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
