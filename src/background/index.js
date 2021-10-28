chrome.runtime.onInstalled.addListener((installedDetails) => {
  // emit in every reload
  if (installedDetails.reason === 'update') {
    console.log('chrome extension update success')
  }
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
        },
        body: JSON.stringify(request.data),
      })
        .then(function (response) {
          return response.json()
        })
        .then(function (json) {
          alert(JSON.stringify(json))
          return sendResponse(json)
        })
        .catch(function (error) {
          // alert('error');
          alert(error)
          return sendResponse(null)
        })
      break
    // 你可以定义任意内容，使用sendResponse()来返回它
    case 'test':
      sendResponse({ msg: 'test' })
      break
  }
})
