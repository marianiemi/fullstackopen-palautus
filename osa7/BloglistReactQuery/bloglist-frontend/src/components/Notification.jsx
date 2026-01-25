import { useNotification } from '../contexts/NotificationContext'

const Notification = () => {
  const [state] = useNotification()
  if (!state?.message) return null

  const style = {
    border: 'solid 1px',
    padding: 10,
    marginBottom: 10,
    color: state.type === 'error' ? 'red' : 'green',
  }

  return <div style={style}>{state.message}</div>
}

export default Notification
