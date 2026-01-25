const AnecdoteForm = ({ onCreate }) => {
  const onSubmit = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    onCreate(content)
  }

  return (
    <form onSubmit={onSubmit}>
      <input name="anecdote" />
      <button type="submit">create</button>
    </form>
  )
}

export default AnecdoteForm
