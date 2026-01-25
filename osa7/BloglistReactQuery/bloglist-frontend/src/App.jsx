import { useEffect, useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'

import blogService from './services/blogs'
import loginService from './services/login'
import { useNotification } from './contexts/NotificationContext'

const notify = (dispatch, message, type = 'success', seconds = 5) => {
  dispatch({ type: 'SHOW', payload: { message, type } })
  setTimeout(() => dispatch({ type: 'CLEAR' }), seconds * 1000)
}

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const blogFormRef = useRef()
  const queryClient = useQueryClient()
  const [, dispatch] = useNotification()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (!loggedUserJSON) return

    const savedUser = JSON.parse(loggedUserJSON)
    setUser(savedUser)
    blogService.setToken(savedUser.token)
  }, [])

  const blogsQuery = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
    enabled: !!user,
    retry: 1,
  })

  const createBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: (createdBlog) => {
      queryClient.setQueryData(['blogs'], (old) =>
        old ? old.concat(createdBlog) : [createdBlog],
      )

      if (blogFormRef.current) {
        blogFormRef.current.toggleVisibility()
      }

      notify(
        dispatch,
        `a new blog ${createdBlog.title} by ${createdBlog.author} added`,
        'success',
      )
    },
    onError: () => notify(dispatch, 'failed to create blog', 'error'),
  })

  const likeBlogMutation = useMutation({
    mutationFn: ({ id, updated }) => blogService.update(id, updated),
    onSuccess: (updatedBlog) => {
      queryClient.setQueryData(['blogs'], (old) =>
        old.map((b) => (b.id === updatedBlog.id ? updatedBlog : b)),
      )
    },
    onError: () => notify(dispatch, 'failed to like blog', 'error'),
  })

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
    } catch (error) {
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

  if (!user) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification />

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

  if (blogsQuery.isLoading) return <div>loading...</div>
  if (blogsQuery.isError) return <div>blog service not available</div>

  const blogs = Array.isArray(blogsQuery.data) ? blogsQuery.data : []

  const sortedBlogs = [...blogs].sort((a, b) => (b.likes || 0) - (a.likes || 0))

  return (
    <div>
      <h2>blogs</h2>

      <Notification />

      <p>
        {user.name} logged in <button onClick={handleLogout}>logout</button>
      </p>

      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm createBlog={(blog) => createBlogMutation.mutate(blog)} />
      </Togglable>

      {sortedBlogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          user={user}
          handleLike={() =>
            likeBlogMutation.mutate({
              id: blog.id,
              updated: {
                ...blog,
                likes: (Number(blog.likes) || 0) + 1,
                user: typeof blog.user === 'object' ? blog.user.id : blog.user,
              },
            })
          }
          handleDelete={() => {
            if (
              window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)
            ) {
              removeBlogMutation.mutate(blog.id)
            }
          }}
        />
      ))}
    </div>
  )
}

export default App
