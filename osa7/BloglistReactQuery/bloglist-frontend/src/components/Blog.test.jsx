import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders title and author, but url and likes are not visible by default', () => {
  const blog = {
    title: 'Test Title',
    author: 'Test Author',
    url: 'https://example.com',
    likes: 7,
    user: { username: 'mluukkai', name: 'Matti Luukkainen' },
  }

  render(
    <Blog
      blog={blog}
      user={{ username: 'mluukkai' }}
      handleLike={() => {}}
      handleDelete={() => {}}
    />,
  )

  screen.getByText('Test Title Test Author')

  const urlElement = screen.getByText('https://example.com')
  expect(urlElement).not.toBeVisible()

  const likesElement = screen.getByText('likes 7')
  expect(likesElement).not.toBeVisible()
})

test('after clicking view, url, likes and user are shown', async () => {
  const blog = {
    title: 'Test Title',
    author: 'Test Author',
    url: 'https://example.com',
    likes: 7,
    user: { username: 'mluukkai', name: 'Matti Luukkainen' },
  }

  render(
    <Blog
      blog={blog}
      user={{ username: 'mluukkai' }}
      handleLike={() => {}}
      handleDelete={() => {}}
    />,
  )

  const user = userEvent.setup()

  const viewButton = screen.getByText('view')
  await user.click(viewButton)

  expect(screen.getByText('https://example.com')).toBeVisible()
  expect(screen.getByText('likes 7')).toBeVisible()
  expect(screen.getByText('Matti Luukkainen')).toBeVisible()
})

test('clicking the like button twice calls event handler twice', async () => {
  const blog = {
    title: 'Test Title',
    author: 'Test Author',
    url: 'https://example.com',
    likes: 7,
    user: { username: 'mluukkai', name: 'Matti Luukkainen' },
  }

  const mockLikeHandler = vi.fn()

  render(
    <Blog
      blog={blog}
      user={{ username: 'mluukkai' }}
      handleLike={mockLikeHandler}
      handleDelete={() => {}}
    />,
  )

  const user = userEvent.setup()

  // avaa yksityiskohdat
  const viewButton = screen.getByText('view')
  await user.click(viewButton)

  const likeButton = screen.getByText('like')

  // paina likea kahdesti
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockLikeHandler).toHaveBeenCalledTimes(2)
})
