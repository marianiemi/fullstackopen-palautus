import { Card, Button } from 'react-bootstrap'

const Blog = ({ blog, user, handleLike, handleDelete }) => {
  const canRemove =
    user &&
    blog.user &&
    (typeof blog.user === 'object'
      ? blog.user.username === user.username
      : blog.user === user.id)

  return (
    <Card bg="dark" text="light" className="mb-3 shadow-sm">
      <Card.Body>
        <Card.Title>{blog.title}</Card.Title>

        <Card.Subtitle className="mb-2 text-secondary">
          {blog.author}
        </Card.Subtitle>

        <Card.Text>
          <a
            href={blog.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-info"
          >
            {blog.url}
          </a>
        </Card.Text>

        <Card.Text>
          ❤️ {blog.likes}{' '}
          <Button
            variant="outline-success"
            size="sm"
            className="ms-2"
            onClick={handleLike}
          >
            like
          </Button>
        </Card.Text>

        <Card.Text className="text-secondary">
          {typeof blog.user === 'object' ? blog.user.name : ''}
        </Card.Text>

        {canRemove && (
          <Button variant="outline-danger" size="sm" onClick={handleDelete}>
            remove
          </Button>
        )}
      </Card.Body>
    </Card>
  )
}

export default Blog
