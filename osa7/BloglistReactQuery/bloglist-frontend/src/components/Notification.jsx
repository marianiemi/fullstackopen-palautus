import { Alert } from 'react-bootstrap'
import { useNotification } from '../contexts/NotificationContext'

const Notification = () => {
  const [state] = useNotification()

  if (!state || !state.message) return null

  const isError = state.type === 'error'

  return (
    <Alert
      className="mb-3 text-white fw-semibold"
      style={{
        backgroundColor: isError ? '#842029' : '#0f5132',
        border: 'none',
      }}
    >
      {state.message}
    </Alert>
  )
}

export default Notification
