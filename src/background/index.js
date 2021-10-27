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
