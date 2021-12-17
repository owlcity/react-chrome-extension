chrome.runtime.onInstalled.addListener((installedDetails) => {
  // emit in every reload
  if (installedDetails.reason === 'update') {
    console.log('chrome extension update success')
  }
})
// 监听url 变化
// console.log(window.location.href)
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  console.log(tabId)
  console.log(changeInfo)
  console.log(tab)
  if (changeInfo.url == undefined) {
    return
  }
  var url = tab.url
  if (
    url != undefined &&
    url.indexOf(
      'amazon.com || amazon.in' ||
        'amazon.de' ||
        'amazon.fr' ||
        'amazon.it' ||
        'amazon.ca' ||
        'amazon.es',
    )
  ) {
    // do something
    let message = {
      // info: '来自bg的情书💌',
      info: 'url-change',
    }
    chrome.tabs.sendMessage(tabId, message, function (res) {
      console.log('url-change')
      console.log(res)
    })
  }
})
chrome.pageAction.onClicked.addListener(function (tab) {
  // console.log('click-tab')
  // console.log(window.location)
  // bg ---> content
  chrome.tabs.query(
    {
      active: true,
      currentWindow: true,
    },
    function (tabs) {
      // console.log('===========')
      // console.log(tabs[0].url)
      // 搜索列表页
      if (tabs[0].url.indexOf('/s?k=') > -1) {
        let message = {
          // info: '来自bg的情书💌',
          info: 'send-content',
        }
        chrome.tabs.sendMessage(tabs[0].id, message, function (res) {
          console.log('bg=>content')
          console.log(res)
        })
      }
    },
  )

  // if (tab.url.indexOf("https://inbox.google.com/*") != -1) {
  //     chrome.tabs.executeScript(tab.id, {
  //         "file": "clicky.js"
  //     }, function () {
  //         console.log("Script Executed .. ");
  //     });
  // }
})

// background.js
chrome.runtime.onInstalled.addListener(function () {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          // 只有打开zmazon才显示pageAction
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { urlContains: 'amazon.com' },
          }),
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { urlContains: 'amazon.in' },
          }),
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { urlContains: 'amazon.de' },
          }),
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { urlContains: 'amazon.fr' },
          }),
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { urlContains: 'amazon.ca' },
          }),
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { urlContains: 'amazon.it' },
          }),
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { urlContains: 'amazon.es' },
          }),
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { urlContains: 'amazon.co.uk' },
          }),
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { urlContains: 'amazon.co.jp' },
          }),
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { urlContains: 'amazon.com.mx' },
          }),
        ],
        actions: [new chrome.declarativeContent.ShowPageAction()],
      },
    ])
  })
})

// 请求接口
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  switch (request.type) {
    case 'get':
      fetch(request.url)
        .then(function (response) {
          return response.json()
        })
        .then(function (json) {
          return sendResponse(json)
        })
        .catch(function (error) {
          return sendResponse(null)
        })
      break
    case 'post':
      fetch(request.url, {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          token: request.data.token ? request.data.token : '',
        },
        body: JSON.stringify(request.data),
      })
        .then(function (response) {
          return response.json()
        })
        .then(function (json) {
          sendResponse(json)
        })
        .catch(function (error) {
          return sendResponse(null)
        })
      // sendResponse这个回调方法，只在同步使用时正常执行，如果要异步使用，必须在处理函数中return true
      return true
      break
    // 你可以定义任意内容，使用sendResponse()来返回它
    case 'test':
      sendResponse({ msg: 'test' })
      break
  }
})
