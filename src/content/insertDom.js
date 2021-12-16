import $ from 'jquery'
import { configApi } from '../config'

export const getableData = () => {
  var parentEl = $('.s-main-slot')
  var matches = parentEl.children('div[data-asin]').not('[hidden]')
  var asinList = []
  for (var i = 0; i < matches.length; i++) {
    // console.log(matches[i].getAttribute('data-asin'))
    var asin = matches[i].getAttribute('data-asin')
    if (asin) {
      asinList.push(asin)
    }
  }
  // console.log(asinList)
  const getCountry = () => {
    let hostname = window.location.hostname
    // let country = 'us'
    switch (hostname) {
      case 'www.amazon.com':
        return 'us'
      case 'www.amazon.in':
        return 'in'
      case 'www.amazon.de':
        return 'de'
      case 'www.amazon.fr':
        return 'fr'
      case 'www.amazon.ca':
        return 'ca'
      case 'www.amazon.it':
        return 'it'
      case 'www.amazon.es':
        return 'es'
      case 'www.amazon.co.jp':
        return 'jp'
      case 'www.amazon.com.mx':
        //  country = 'mx';
        return 'mx'
      case 'www.amazon.co.uk':
        //  country = 'mx';
        return 'uk'

      default:
        // country = 'us';
        return 'us'
    }
  }
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(['testinfo'], function (result) {
      // console.log('--------------')
      // console.log(result.testinfo)
      // console.log(getCountry())
      let country = getCountry()
      if (result.testinfo) {
        chrome.runtime.sendMessage(
          {
            // 里面的值应该可以自定义，用于判断哪个请求之类的
            type: 'post',
            url: configApi + '/api/index/getproductlistbyasinlist', // 需要请求的url
            data: {
              asinList: asinList,
              token: result.testinfo.userinfo.token,
              country,
            },
          },
          (json) => {
            // console.log(json)
            if (!json || json.code !== 200) {
              reject(json)
            }
            let asignArr = json.data || []
            if (!asignArr.length) {
              console.log('暂无数据')
              resolve({
                empty: true,
              })
              return
            }
            /**
             * resultarr 排序后数组
             * 返回数据与请求参数数组顺序不一致,排序
             */
            let resultarr = []
            asinList.map((item) => {
              let arr = asignArr.filter((list) => {
                return list.asin === item
              })
              // 防止返回数据不一致出现undefind
              if (arr[0]) {
                resultarr.push(arr[0])
              }
            })
            // console.log('-------------')
            // console.log(resultarr)
            // list === asignArr['asin']
            // resultarr.push(item)
            // console.log(asinList)

            asignArr.map((item) => {
              if (item.asin) {
                var asinhtml = `
                <div class="asin-wrap">
                  <div class="asin-title">ASIN: ${item.asin}</div>
                  <div class="asin-item">售价: ${item.price}</div>
                  <div class="asin-item">日销量: ${item.estimatedDaySales || '暂无数据'}</div>
                  <div class="asin-item">月销量: ${item.estimatedSales || '暂无数据'}</div>
                  <div class="asin-item">净利润: ${item.net || '暂无数据'}</div>
                  <div class="asin-item">月收入: ${item.estRevenue || '暂无数据'}</div>
                  <div class="asin-item">上架时间: ${item.listedAtDate || '暂无数据'}</div>
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
            // console.log('------------')
            // console.log(resultarr)
            resolve(resultarr)
          },
        )
      }
    })
  })
}
