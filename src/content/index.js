import React, { useState, useRef, useEffect } from 'react'
import ReactDOM from 'react-dom'
import SignIn from './SignIn'
import TableData from './TableData'
import { useTheme } from '@material-ui/core/styles'
import Zoom from '@material-ui/core/Zoom'
import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add'
import CloseIcon from '@material-ui/icons/Close'
import './content.less'
import './insertDom'
const fabStyle = {
  position: 'fixed',
  bottom: 26,
  right: 16,
}
const fabStyle1 = {
  position: 'absolute',
  top: -30,
  right: 6,
  zIndex: 111,
}
function App() {
  const [loginValue, setLoginValue] = useState(false)
  const [corner, setCorner] = useState(0)
  const theme = useTheme()
  const transitionDuration = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen,
  }
  chrome.storage.local.get(['login'], function (result) {
    console.log('Value currently is ' + result.login)
    if (result.login) {
      setLoginValue(true)
    }
  })

  const closeExt = () => {
    setCorner(0)
  }
  const handleLogin = (state) => {
    setLoginValue(state)
  }
  return (
    <div>
      {corner ? (
        <div>
          {loginValue ? (
            <TableData closeExt={closeExt}></TableData>
          ) : (
            <SignIn handleLogin={handleLogin}></SignIn>
          )}
        </div>
      ) : (
        <Zoom
          in={corner === 0}
          timeout={transitionDuration}
          style={{
            transitionDelay: `${corner === 0 ? transitionDuration.exit : 0}ms`,
          }}
          unmountOnExit
        >
          <Fab
            sx={fabStyle}
            aria-label="Add"
            color="primary"
            onClick={() => {
              setCorner(1)
            }}
          >
            <AddIcon />
          </Fab>
        </Zoom>
      )}
    </div>
  )
}

const root = document.createElement('div')
root.id = 'crx-root'
document.body.appendChild(root)

ReactDOM.render(<App />, document.getElementById('crx-root'))
