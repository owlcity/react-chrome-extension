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
  const handleLogin = (state) => {
    setLoginValue(state)
  }
  return (
    <div>
      {corner ? (
        <div className="extension-wrap">
          {loginValue ? (
            <div
            // onClick={() => {
            //   setloginValue(false)
            // }}
            >
              <TableData></TableData>
            </div>
          ) : (
            <SignIn handleLogin={handleLogin}></SignIn>
          )}
          <Zoom
            in={corner === 1}
            timeout={transitionDuration}
            style={{
              transitionDelay: `${corner === 1 ? transitionDuration.exit : 0}ms`,
            }}
            unmountOnExit
          >
            <Fab
              sx={fabStyle1}
              aria-label="Add"
              color="#000"
              onClick={() => {
                setCorner(0)
              }}
            >
              <CloseIcon />
            </Fab>
          </Zoom>
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

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('crx-root'),
)
