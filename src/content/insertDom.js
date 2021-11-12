import $ from 'jquery'
import { configApi } from '../config'

export const getableData = () => {
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
  console.log(asinList)
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      {
        // 里面的值应该可以自定义，用于判断哪个请求之类的
        type: 'post',
        url: configApi + '/api/index/getproductlistbyasinlist', // 需要请求的url
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
            var wraphtml = $(`[data-asin=${item.asin}]`).children('.sg-col-inner')
            let hasDom = $(`[data-asin=${item.asin}]`).find('.asin-wrap').length
            if (!hasDom) {
              if (wraphtml.find('.a-section.a-spacing-medium').length) {
                wraphtml.find('.a-section.a-spacing-medium').append(asinhtml)
              } else {
                wraphtml.append(asinhtml)
              }
            }
          }
        })
        resolve(json)
      },
    )
  })
}
