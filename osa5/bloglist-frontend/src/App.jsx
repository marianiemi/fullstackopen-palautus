import { useEffect, useRef, useState } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

const App = () => {
  // blogilista backendistä
  const [blogs, setBlogs] = useState([])

  // kirjautumislomakkeen kentät
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  // kirjautunut käyttäjä (sisältää tokenin)
  const [user, setUser] = useState(null)

  // ref Togglable-komponenttiin (blogilomakkeen piilottamiseen)
  const blogFormRef = useRef()

  // notifikaatiot (viesti + tyyppi)
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

  // haetaan blogit backendistä
  useEffect(() => {
    const fetchBlogs = async () => {
      const blogs = await blogService.getAll()
      setBlogs(blogs)
    }
    fetchBlogs()
  }, [])

  // tarkistetaan onko käyttäjä jo kirjautunut (localStorage)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)

      setUser(user)
      setUsername('')
      setPassword('')
    } catch (error) {
      showNotification('wrong username/password', 'error')
    }
  }

  // Uuden blogin lisäys

  const addBlog = async (blogObject) => {
    try {
      const createdBlog = await blogService.create(blogObject)

      // piilotetaan lomake onnistuneen lisäyksen jälkeen
      if (blogFormRef.current) {
        blogFormRef.current.toggleVisibility()
      }

      setBlogs((prev) => prev.concat(createdBlog))

      showNotification(
        `a new blog ${createdBlog.title} by ${createdBlog.author} added`,
        'success'
      )
    } catch (error) {
      showNotification('failed to create blog', 'error')
    }
  }

  // Blogin tykkäys

  const likeBlog = async (blog) => {
    try {
      const id = blog.id || blog._id
      const userId = blog.user?.id || blog.user?._id || blog.user

      const updatedBlogData = {
        user: userId,
        likes: blog.likes + 1,
        author: blog.author,
        title: blog.title,
        url: blog.url,
      }

      const updatedBlog = await blogService.update(id, updatedBlogData)

      // 5.9-korjaus: säilytetään user-objekti UI:ssa
      const updatedForUi = {
        ...updatedBlog,
        id: updatedBlog.id || updatedBlog._id || id,
        user:
          typeof updatedBlog.user === 'string' ? blog.user : updatedBlog.user,
      }

      setBlogs((prev) =>
        prev.map((b) => ((b.id || b._id) === id ? updatedForUi : b))
      )

      showNotification(`${blog.title} liked`, 'success')
    } catch (error) {
      showNotification('failed to like blog', 'error')
    }
  }

  // Blogin poisto

  const deleteBlog = async (blog) => {
    const id = blog.id || blog._id

    const ok = window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)
    if (!ok) return

    try {
      await blogService.remove(id)
      setBlogs((prev) => prev.filter((b) => (b.id || b._id) !== id))
      showNotification(`deleted ${blog.title}`, 'success')
    } catch (error) {
      showNotification('failed to delete blog', 'error')
    }
  }

  // Käyttäjän uloskirjautuminen

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken(null)
    setUser(null)
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

  // Blogien järjestäminen tykkäysten mukaan

  const sortedBlogs = [...blogs].sort((a, b) => {
    const likesA = Number(a.likes) || 0
    const likesB = Number(b.likes) || 0
    return likesB - likesA
  })

  // kirjautuneena olevan käyttäjän näkymä

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

      <h3>blogs</h3>
      {sortedBlogs.map((blog) => (
        <Blog
          key={blog.id || blog._id}
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
