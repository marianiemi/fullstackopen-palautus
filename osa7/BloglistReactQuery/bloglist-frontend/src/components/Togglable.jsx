import { useImperativeHandle, useState, forwardRef } from 'react'
import { Button } from 'react-bootstrap'

const Togglable = forwardRef(({ buttonLabel, children }, ref) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(ref, () => ({
    toggleVisibility,
  }))

  return (
    <div className="mb-4">
      <div style={hideWhenVisible}>
        <Button variant="primary" onClick={toggleVisibility}>
          {buttonLabel}
        </Button>
      </div>

      <div style={showWhenVisible}>
        {children}
        <Button variant="secondary" className="mt-2" onClick={toggleVisibility}>
          cancel
        </Button>
      </div>
    </div>
  )
})

Togglable.displayName = 'Togglable'

export default Togglable
