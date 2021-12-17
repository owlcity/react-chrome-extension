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
import { ChartDom } from './insertChart'

let corner = 0
let loadedContent = false

let url = window.location.href
// 详情页
// console.log(url)
// console.log('----------')
if (url.indexOf('/dp/') > -1) {
  console.log('----------')
  ChartDom()
  console.log('insert-chart')
}

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
  const [pop, setPop] = useState(0)
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
  /**
   * 为什么要这样写 用户每次点击插件图标时，content.js 都会被执行 所以要使用全局变量
   * https://juejin.cn/post/6970912734086955045
   *  */
  const setCorner = (status) => {
    corner = status
    setPop(corner)
  }
  if (!loadedContent) {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      console.log(request.info)
      // 这里是返回给bg的内容
      // console.log('------------')
      // console.log('corner---', corner)
      if (request.info === 'send-content') {
        let status = corner ? 0 : 1
        setCorner(status)
      }
      // sendResponse('get the message')
    })
    loadedContent = true
  }

  const closeExt = () => {
    let status = corner ? 0 : 1
    setCorner(status)
  }
  const handleLogin = (state) => {
    setLoginValue(state)
  }
  return (
    <div>
      {pop ? (
        <div>
          {loginValue ? (
            <TableData closeExt={closeExt} handleLogin={handleLogin}></TableData>
          ) : (
            <SignIn closeExt={closeExt} handleLogin={handleLogin}></SignIn>
          )}
        </div>
      ) : (
        <div className="extAddIcon">
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
                closeExt()
              }}
            >
              <AddIcon />
            </Fab>
          </Zoom>
        </div>
      )}
    </div>
  )
}

const root = document.createElement('div')
root.id = 'crx-root'
document.body.appendChild(root)

ReactDOM.render(<App />, document.getElementById('crx-root'))
