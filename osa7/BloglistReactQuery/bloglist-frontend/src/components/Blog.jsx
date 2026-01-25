import { useState } from 'react'

const Blog = ({ blog, user, handleLike, handleDelete }) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => setVisible(!visible)

  // Selvitetään "omistaja" robustisti eri muotoja varten
  const blogUser = blog.user

  const blogOwnerUsername =
    typeof blogUser === 'object' ? blogUser.username : blogUser

  const blogOwnerId =
    typeof blogUser === 'object' ? blogUser.id || blogUser._id : null

  const loggedUsername = user?.username
  const loggedId = user?.id || user?._id

  const canRemove =
    (blogOwnerUsername &&
      loggedUsername &&
      blogOwnerUsername === loggedUsername) ||
    (blogOwnerId && loggedId && blogOwnerId === loggedId)

  return (
    <div
      className="blog"
      style={{ border: '1px solid', padding: 8, marginBottom: 8 }}
    >
      <div style={hideWhenVisible}>
        {blog.title} {blog.author}{' '}
        <button onClick={toggleVisibility}>view</button>
      </div>

      <div style={showWhenVisible}>
        <div>
          {blog.title} {blog.author}{' '}
          <button onClick={toggleVisibility}>hide</button>
        </div>

        <div>{blog.url}</div>

        <div>
          likes {blog.likes} <button onClick={handleLike}>like</button>
        </div>

        <div>
          {typeof blogUser === 'object' ? blogUser.name : blogOwnerUsername}
        </div>

        {canRemove && <button onClick={handleDelete}>delete</button>}
      </div>
    </div>
  )
}

export default Blog
