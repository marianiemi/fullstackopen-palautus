import { useState } from 'react'
import { Form, Button, Card } from 'react-bootstrap'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()

    createBlog({
      title,
      author,
      url,
    })

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <Card bg="dark" text="light" className="mb-4 shadow-sm">
      <Card.Body>
        <Card.Title>Create new blog</Card.Title>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              value={title}
              onChange={({ target }) => setTitle(target.value)}
              placeholder="Blog title"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Author</Form.Label>
            <Form.Control
              type="text"
              value={author}
              onChange={({ target }) => setAuthor(target.value)}
              placeholder="Author name"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>URL</Form.Label>
            <Form.Control
              type="text"
              value={url}
              onChange={({ target }) => setUrl(target.value)}
              placeholder="https://example.com"
              required
            />
          </Form.Group>

          <Button variant="success" type="submit">
            create
          </Button>
        </Form>
      </Card.Body>
    </Card>
  )
}

export default BlogForm
