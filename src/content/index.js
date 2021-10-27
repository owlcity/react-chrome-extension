import React, { useState, useRef, useEffect } from 'react'
import ReactDOM from 'react-dom'
import SignIn from './SignIn'
function App() {
  const [parentValue, setParentValue] = useState(false)
  const handleLogin = (state) => {
    setParentValue(state)
  }
  return (
    <div>
      {parentValue ? (
        <div
          onClick={() => {
            setParentValue(false)
          }}
        >
          1111
        </div>
      ) : (
        <SignIn handleLogin={handleLogin}></SignIn>
      )}
    </div>
  )
}

const root = document.createElement('div')
root.style.cssText = `width:100%;height:400px;bottom: 0; left: 0; position: fixed; z-index: 100001;background:#fff;border-top:1px solid #cbcdd1`
root.id = 'crx-root'
document.body.appendChild(root)

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('crx-root'),
)
