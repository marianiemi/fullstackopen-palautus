import { useEffect, useRef, useState } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [user, setUser] = useState(null)

  const blogFormRef = useRef()

  const [notification, setNotification] = useState(null)
  const [notificationType, setNotificationType] = useState(null)

  const showNotification = (message, type = 'success') => {
    setNotification(message)
    setNotificationType(type)

    setTimeout(() => {
      setNotification(null)
      setNotificationType(null)
    }, 5000)
  }

  const fetchBlogs = async () => {
    try {
      const blogsFromServer = await blogService.getAll()
      setBlogs(blogsFromServer)
    } catch (e) {
      showNotification('failed to fetch blogs', 'error')
    }
  }

  // Palautetaan kirjautunut käyttäjä localStoragesta ja haetaan blogit tokenin kanssa
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const savedUser = JSON.parse(loggedUserJSON)
      setUser(savedUser)
      blogService.setToken(savedUser.token)
      fetchBlogs()
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const loggedInUser = await loginService.login({ username, password })

      window.localStorage.setItem(
        'loggedBlogappUser',
        JSON.stringify(loggedInUser),
      )
      blogService.setToken(loggedInUser.token)

      setUser(loggedInUser)
      setUsername('')
      setPassword('')

      await fetchBlogs()
      showNotification('logged in', 'success')
    } catch (error) {
      showNotification('wrong username/password', 'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken(null)
    setUser(null)
    setBlogs([])
  }

  const addBlog = async (blogObject) => {
    try {
      const createdBlog = await blogService.create(blogObject)

      if (blogFormRef.current) {
        blogFormRef.current.toggleVisibility()
      }

      setBlogs((prev) => prev.concat(createdBlog))

      showNotification(
        `a new blog ${createdBlog.title} by ${createdBlog.author} added`,
        'success',
      )
    } catch (error) {
      showNotification('failed to create blog', 'error')
    }
  }

  const likeBlog = async (blog) => {
    try {
      const id = blog.id

      // FSO backend yleensä odottaa, että user on id (string)
      const updatedBlogData = {
        title: blog.title,
        author: blog.author,
        url: blog.url,
        likes: (Number(blog.likes) || 0) + 1,
        user: typeof blog.user === 'object' ? blog.user.id : blog.user,
      }

      const updatedBlog = await blogService.update(id, updatedBlogData)

      // Säilytetään user-objekti UI:ssa, jotta Blog-komponentti voi näyttää nimen
      const updatedForUi = {
        ...updatedBlog,
        user: typeof blog.user === 'object' ? blog.user : updatedBlog.user,
      }

      setBlogs((prev) => prev.map((b) => (b.id === id ? updatedForUi : b)))
      showNotification(`${blog.title} liked`, 'success')
    } catch (error) {
      showNotification('failed to like blog', 'error')
    }
  }

  const deleteBlog = async (blog) => {
    const ok = window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)
    if (!ok) return

    try {
      await blogService.remove(blog.id)
      setBlogs((prev) => prev.filter((b) => b.id !== blog.id))
      showNotification(`deleted ${blog.title}`, 'success')
    } catch (error) {
      showNotification('failed to delete blog', 'error')
    }
  }

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
    )
  }

  const sortedBlogs = [...blogs].sort((a, b) => {
    const likesA = Number(a.likes) || 0
    const likesB = Number(b.likes) || 0
    return likesB - likesA
  })

  return (
    <div>
      <h2>blogs</h2>

      <Notification message={notification} type={notificationType} />

      <p>
        {user.name} logged in <button onClick={handleLogout}>logout</button>
      </p>

      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>

      {sortedBlogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          user={user}
          handleLike={() => likeBlog(blog)}
          handleDelete={() => deleteBlog(blog)}
        />
      ))}
    </div>
  )
}

export default App
