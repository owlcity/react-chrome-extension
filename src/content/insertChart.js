import React, { useState, useRef, useEffect } from 'react'
import ReactDOM from 'react-dom'
import CloseIcon from '@material-ui/icons/Close'
import PersonIcon from '@material-ui/icons/Person'
// import { Line } from '@antv/g2plot';
import $ from 'jquery'
import { getChartData } from './chartData'

export const ChartDom = () => {
  const conWidth = $('#dp-container').width()
  console.log('---------------')
  console.log(conWidth)
  getChartData()
  function Chart() {
    return (
      <div className="m-chart" style={{ width: conWidth + 'px' }}>
        <div className="m-chart-top">
          <div className="ext-title">
            <div className="ext-l">
              <i className="color-333">
                <PersonIcon className="a-cursor" color="#333" fontSize="small" />
              </i>
              <span className="color-333 ext-padding">xxxxx</span>
              <span className="chart-gray">退出</span>
            </div>
            <div className="ext-m">
              <img
                className="title-logo"
                src="data:image/jpg;base64,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"
                alt=""
              />
            </div>
            <div className="ext-r">
              <span className="icon-item">
                <CloseIcon className="a-cursor" color="#999" />
              </span>
            </div>
          </div>
        </div>
        <div className="m-chart-con">
          <div className="m-chart-l">
            <div className="m-chart-title">ASIN:B07PVKZ7DG</div>
            <div className="m-chart-video">监控</div>
            <div className="m-chart-ul">
              <div className="m-chart-li">
                <span className="chart-gray">月销量 </span>5678
              </div>
              <div className="m-chart-li">
                <span className="chart-gray">上架时间 </span>5678
              </div>
              <div className="m-chart-li">
                <span className="chart-gray">评论数 </span>5678
              </div>
              <div className="m-chart-li">
                <span className="chart-gray">毛利润 </span>¥5678
              </div>
              <div className="m-chart-li">
                <span className="chart-gray">费用 </span>¥5678
              </div>
            </div>
          </div>
          <div className="m-chart-r">
            <div id="container"></div>
          </div>
        </div>
      </div>
    )
  }

  const root = document.createElement('div')
  root.id = 'chart-root'
  // document.body.appendChild(root)
  $('#dp-container').before(root)

  ReactDOM.render(<Chart />, document.getElementById('chart-root'))
}
