import $ from 'jquery'

var parentEl = $('.s-main-slot')
var matches = parentEl.find('div[data-asin]')
var asinList = []
for (var i = 0; i < matches.length; i++) {
  // console.log(matches[i].getAttribute('data-asin'))
  var asin = matches[i].getAttribute('data-asin')
  if (asin) {
    asinList.push(asin)
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
        // console.log('------------')
        // console.log(json)
        let asignArr = json.data
        asignArr.map((item) => {
          if (item.asin) {
            var asinhtml = `
            <div class="asin-wrap">
              <div class="asin-title">ASIN: ${item.asin}</div>
              <div class="asin-item">售价: ${item.price}</div>
              <div class="asin-item">日销量: ${item.estimatedDaySales}</div>
              <div class="asin-item">月销量: ${item.estimatedSales}</div>
              <div class="asin-item">净利润: ${item.net}</div>
              <div class="asin-item">月收入: ${item.estRevenue}</div>
              <div class="asin-item">上架时间: ${item.listedAtDate}</div>
            </div>`
            // console.log('------', asinhtml)
            // 插入dom
            var wraphtml = $(`[data-asin=${item.asin}]`).find('.s-widget-container')
            let hasDom = $(`[data-asin=${item.asin}]`).find('.s-widget-container .asin-wrap').length
            if (!hasDom) {
              $(`[data-asin=${item.asin}]`)
                .find('.s-widget-container .s-card-container')
                .append(asinhtml)
            }
          }
        })
        resolve(json)
      },
    )
  })
}
