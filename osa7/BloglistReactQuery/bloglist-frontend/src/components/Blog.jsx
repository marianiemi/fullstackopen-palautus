import { useState } from 'react'

const Blog = ({ blog, user, handleLike, handleDelete }) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const canRemove =
    user &&
    blog.user &&
    (typeof blog.user === 'object'
      ? blog.user.username === user.username
      : blog.user === user.id)

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}{' '}
        <button onClick={() => setVisible(!visible)}>
          {visible ? 'hide' : 'view'}
        </button>
      </div>

      {visible && (
        <div>
          <div>{blog.url}</div>
          <div>
            likes {blog.likes}{' '}
            <button onClick={handleLike} type="button">
              like
            </button>
          </div>
          <div>{typeof blog.user === 'object' ? blog.user.name : ''}</div>

          {canRemove && (
            <button onClick={handleDelete} type="button">
              remove
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog
