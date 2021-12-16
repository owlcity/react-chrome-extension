import React, { useCallback } from 'react'
import ReactDOM from 'react-dom'
import '../style/popup.less'
import { configApi } from '../config'

// maingest.json
// "page_action": {
//   "default_title": "亚马逊商品分析",
//   "default_icon": "assets/logo.png"
//   "default_popup": "pages/popup.html"
// },

function App() {
  // get static files by chrome.runtime.getURL
  const logo = chrome.runtime.getURL('assets/logo.png')
  const goToOptions = useCallback(() => {
    // go to options page
    // chrome.runtime.openOptionsPage()
    window.open(configApi)
  }, [])
  return (
    <div className="app">
      <img src={logo} className="logo" />
      <div className="btn-wrapper">
        <div
          onClick={goToOptions}
          className="crx-btn"
          style={{ width: 150, height: 30, lineHeight: '30px', cursor: 'pointer' }}
        >
          去主页
        </div>
      </div>
    </div>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
)
