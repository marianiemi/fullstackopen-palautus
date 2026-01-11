import { useEffect, useState } from "react";
import Blog from "./components/Blog";
import Notification from "./components/Notification";
import blogService from "./services/blogs";
import loginService from "./services/login";

const App = () => {
  // bloglist from backend
  const [blogs, setBlogs] = useState([]);

  // fields for login form
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // logged in user
  const [user, setUser] = useState(null);

  // add blog form fields
  const [newTitle, setNewTitle] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newUrl, setNewUrl] = useState("");

  // notification message and type
  const [notification, setNotification] = useState(null);
  const [notificationType, setNotificationType] = useState(null);

  // show notification helper
  const showNotification = (message, type = "success") => {
    setNotification(message);
    setNotificationType(type);

    setTimeout(() => {
      setNotification(null);
      setNotificationType(null);
    }, 5000);
  };

  // get all blogs from backend
  useEffect(() => {
    const fetchBlogs = async () => {
      const blogs = await blogService.getAll();
      setBlogs(blogs);
    };
    fetchBlogs();
  }, []);

  // check for logged in user in localStorage
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  // Login handling
  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({ username, password });

      // save logged in user to localStorage
      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));

      // set token for blogService
      blogService.setToken(user.token);

      setUser(user);
      setUsername("");
      setPassword("");
    } catch (error) {
      showNotification("wrong username/password", "error");
    }
  };

  // Adding a new blog

  const addBlog = async (event) => {
    event.preventDefault();

    try {
      const createdBlog = await blogService.create({
        title: newTitle,
        author: newAuthor,
        url: newUrl,
      });

      // add created blog to state
      setBlogs(blogs.concat(createdBlog));

      // clear form fields
      setNewTitle("");
      setNewAuthor("");
      setNewUrl("");

      showNotification(
        `a new blog ${createdBlog.title} by ${createdBlog.author} added`,
        "success"
      );
    } catch (error) {
      showNotification("failed to create blog", "error");
    }
  };

  // Logout handling

  const handleLogout = () => {
    window.localStorage.removeItem("loggedBlogappUser");
    blogService.setToken(null);
    setUser(null);
  };

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>

        <Notification message={notification} type={notificationType} />

        <form onSubmit={handleLogin}>
          <div>
            <label>
              username
              <input
                type="text"
                value={username}
                onChange={({ target }) => setUsername(target.value)}
              />
            </label>
          </div>
          <div>
            <label>
              password
              <input
                type="password"
                value={password}
                onChange={({ target }) => setPassword(target.value)}
              />
            </label>
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    );
  }

  // Main app view when logged in

  return (
    <div>
      <h2>blogs</h2>

      <Notification message={notification} type={notificationType} />

      <p>
        {user.name} logged in <button onClick={handleLogout}>logout</button>
      </p>

      <h3>create new</h3>
      <form onSubmit={addBlog}>
        <div>
          <label>
            title
            <input
              type="text"
              value={newTitle}
              onChange={({ target }) => setNewTitle(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            author
            <input
              type="text"
              value={newAuthor}
              onChange={({ target }) => setNewAuthor(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            url
            <input
              type="text"
              value={newUrl}
              onChange={({ target }) => setNewUrl(target.value)}
            />
          </label>
        </div>
        <button type="submit">create</button>
      </form>

      <h3>blogs</h3>
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  );
};

export default App;
