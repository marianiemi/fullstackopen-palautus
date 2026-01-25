import { useEffect, useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Container, Button, Form } from 'react-bootstrap'

import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'

import blogService from './services/blogs'
import loginService from './services/login'
import { useNotification } from './contexts/NotificationContext'

/* =========================
   Notification helper
   ========================= */
const notify = (dispatch, message, type = 'success', seconds = 5) => {
  dispatch({ type: 'SHOW', payload: { message, type } })
  setTimeout(() => dispatch({ type: 'CLEAR' }), seconds * 1000)
}

const App = () => {
  /* =========================
     Local component state
     ========================= */
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const blogFormRef = useRef()
  const queryClient = useQueryClient()
  const [, dispatch] = useNotification()

  /* =========================
     Restore logged-in user
     ========================= */
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (!loggedUserJSON) return

    const savedUser = JSON.parse(loggedUserJSON)
    setUser(savedUser)
    blogService.setToken(savedUser.token)
  }, [])

  /* =========================
     Fetch blogs with React Query
     ========================= */
  const blogsQuery = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
    enabled: !!user,
    retry: 1,
  })

  /* =========================
     Create blog mutation
     ========================= */
  const createBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: (createdBlog) => {
      queryClient.setQueryData(['blogs'], (old) =>
        Array.isArray(old) ? old.concat(createdBlog) : [createdBlog],
      )

      blogFormRef.current?.toggleVisibility()

      notify(
        dispatch,
        `a new blog ${createdBlog.title} by ${createdBlog.author} added`,
        'success',
      )
    },
    onError: () => notify(dispatch, 'failed to create blog', 'error'),
  })

  /* =========================
     Like blog mutation
     ========================= */
  const likeBlogMutation = useMutation({
    mutationFn: ({ id, updated }) => blogService.update(id, updated),
    onSuccess: (updatedBlog) => {
      queryClient.setQueryData(['blogs'], (old) =>
        old.map((b) => (b.id === updatedBlog.id ? updatedBlog : b)),
      )
    },
    onError: () => notify(dispatch, 'failed to like blog', 'error'),
  })

  /* =========================
     Remove blog mutation
     ========================= */
  const removeBlogMutation = useMutation({
    mutationFn: (id) => blogService.remove(id),
    onSuccess: (_, removedId) => {
      queryClient.setQueryData(['blogs'], (old) =>
        old.filter((b) => b.id !== removedId),
      )
      notify(dispatch, 'blog removed', 'success')
    },
    onError: () => notify(dispatch, 'failed to delete blog', 'error'),
  })

  /* =========================
     Authentication handlers
     ========================= */
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

      notify(dispatch, `welcome ${loggedInUser.name}`, 'success')
    } catch {
      notify(dispatch, 'wrong username/password', 'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken(null)
    setUser(null)
    queryClient.removeQueries({ queryKey: ['blogs'] })
    notify(dispatch, 'logged out', 'success')
  }

  /* =========================
     Blog action handlers
     ========================= */
  const addBlog = (blogObject) => {
    createBlogMutation.mutate(blogObject)
  }

  const likeBlog = (blog) => {
    const updated = {
      ...blog,
      likes: (Number(blog.likes) || 0) + 1,
      user: typeof blog.user === 'object' ? blog.user.id : blog.user,
    }

    likeBlogMutation.mutate({ id: blog.id, updated })
  }

  const deleteBlog = (blog) => {
    const ok = window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)
    if (!ok) return
    removeBlogMutation.mutate(blog.id)
  }

  /* =========================
     Login view
     ========================= */
  if (!user) {
    return (
      <Container fluid className="bg-dark text-light min-vh-100 py-4">
        <Container style={{ maxWidth: 520 }}>
          <h2 className="mb-4">Log in to application</h2>
          <Notification />

          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3">
              <Form.Label>username</Form.Label>
              <Form.Control
                type="text"
                value={username}
                autoComplete="username"
                onChange={({ target }) => setUsername(target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                autoComplete="current-password"
                onChange={({ target }) => setPassword(target.value)}
              />
            </Form.Group>

            <Button type="submit">login</Button>
          </Form>
        </Container>
      </Container>
    )
  }

  /* =========================
     Blogs view
     ========================= */
  if (blogsQuery.isLoading) return <div>loading...</div>
  if (blogsQuery.isError) return <div>blog service not available</div>

  const blogs = blogsQuery.data ?? []
  const sortedBlogs = [...blogs].sort((a, b) => (b.likes || 0) - (a.likes || 0))

  return (
    <Container fluid className="bg-dark text-light min-vh-100 py-4">
      <Container>
        <h2 className="mb-4">Blogs</h2>

        <Notification />

        <div className="d-flex justify-content-between mb-4">
          <span>{user.name} logged in</span>
          <Button variant="outline-light" size="sm" onClick={handleLogout}>
            logout
          </Button>
        </div>

        <Togglable buttonLabel="create new blog" ref={blogFormRef}>
          <BlogForm createBlog={addBlog} />
        </Togglable>

        <div className="mt-4">
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
      </Container>
    </Container>
  )
}

export default App
