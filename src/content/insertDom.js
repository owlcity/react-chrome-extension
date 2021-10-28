import $ from 'jquery'

var parentEl = $('.s-main-slot')
var matches = parentEl.find('div[data-asin]')
var asinList = []
for (var i = 0; i < matches.length; i++) {
  console.log(matches[i].getAttribute('data-asin'))
  var asin = matches[i].getAttribute('data-asin')
  if (asin) {
    asinList.push(asin)
    var asinhtml = `<div class="asin-wrap"><div class="asin-title">ASIN: ${asin}</div></div>`
    $(matches[i]).find('.s-widget-container').append(asinhtml)
  }
}

export const getableData = () => {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      {
        // 里面的值应该可以自定义，用于判断哪个请求之类的
        type: 'post',
        url: 'https://amz.demo.57xg.com/api/index/getproductlistbyasinlist', // 需要请求的url
        data: {
          asinList: asinList,
        },
      },
      (json) => {
        resolve(json)
      },
    )
  })
}
