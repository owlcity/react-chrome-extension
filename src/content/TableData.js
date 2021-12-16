import React, { useState, useEffect, Fragment } from 'react'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell, { tableCellClasses } from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Skeleton from '@material-ui/core/Skeleton'
import TableSortLabel from '@material-ui/core/TableSortLabel'
import CloseIcon from '@material-ui/icons/Close'
import AutorenewIcon from '@material-ui/icons/Autorenew'
import FilterNoneIcon from '@material-ui/icons/FilterNone'
import PersonIcon from '@material-ui/icons/Person'
import StarIcon from '@material-ui/icons/Star'
import VoiceChatIcon from '@material-ui/icons/VoiceChat'
import Draggable from 'react-draggable'
import { styled } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Paper from '@material-ui/core/Paper'
import Alert from '@material-ui/core/Alert'
import Grid from '@material-ui/core/Grid'
import Rating from '@material-ui/core/Rating'
import Stack from '@material-ui/core/Stack'
import Snackbar from '@material-ui/core/Snackbar'
import Modal from '@material-ui/core/Modal'
import { getableData } from './insertDom'
import { configApi } from '../config'

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein }
}
const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}))
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#f7fafa',
    color: '#555',
    height: '38px',
  },
}))
function descendingComparator(a, b, orderBy) {
  // console.log('------------')
  // console.log(a)
  // console.log(b)
  // console.log(orderBy)
  // console.log('------------')
  if (!a || !b) {
    return 0
  }
  if (Number(b[orderBy]) < Number(a[orderBy])) {
    return -1
  }
  if (Number(b[orderBy]) > Number(a[orderBy])) {
    return 1
  }

  return 0
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy)
}
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index])
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0])
    if (order !== 0) {
      return order
    }
    return a[1] - b[1]
  })
  return stabilizedThis.map((el) => el[0])
}
const headCells = [
  {
    id: 'name',
    numeric: false,
    label: '名称',
  },
  {
    id: 'estimatedSales',
    numeric: true,
    label: '月销量',
  },
  {
    id: 'estimatedDaySales',
    numeric: true,
    label: '日销量',
  },
  {
    id: 'price',
    numeric: true,
    label: '售价',
  },
  {
    id: 'net',
    numeric: true,
    label: '净利润',
  },
  {
    id: 'estRevenue',
    numeric: true,
    label: '月收入',
  },
  {
    id: 'rating',
    numeric: true,
    label: '星级',
  },
  {
    id: 'listedAtDate',
    numeric: false,
    label: '上架时间',
  },
]
function EnhancedTableHead(props) {
  const { order, orderBy, rowCount, onRequestSort } = props
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property)
  }

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell, index) => (
          <StyledTableCell
            key={index}
            align={'center'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {/* {orderBy === headCell.id ? (
                <Box component="span">
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null} */}
            </TableSortLabel>
          </StyledTableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}
let loadingCon = false
export default function BasicTable(props) {
  const { handleLogin } = props
  const [rows, setRows] = useState([])
  const [empty, setEmpty] = useState(false)
  const [order, setOrder] = useState('asc')
  const [orderBy, setOrderBy] = useState('name')
  const [disabled, setDisabled] = useState(true)
  const [loading, setLoading] = useState(false)
  const [info, setInfo] = useState({})
  const [userinfo, setUserinfo] = useState(null)
  const [msg, setMsg] = useState('')
  const [open, setOpen] = useState(false)
  const [modal, setModal] = useState(false)
  const [url, setUrl] = useState(window.location.href)

  if (!loadingCon) {
    loadingCon = true
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      // console.log(request.info)
      // 这里是返回给bg的内容
      // console.log('------------')
      // console.log('corner---', corner)
      if (request.info === 'url-change') {
        // console.log('----------')
        setLoading(false)
        // document.onload 执行
        setTimeout(() => {
          getTableList()
        }, 1500)
        console.log('url-change')
      }
      // sendResponse('get the message')
    })
  }

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }
  const handleClose = () => {
    props.closeExt()
  }

  const handleModal = () => {
    setModal(false)
  }
  const miniorClose = () => {
    setOpen(false)
  }
  const handleExit = () => {
    // console.log(handleLogin)
    chrome.storage.local.clear(function () {
      handleLogin(false)
      handleClose()
      var error = chrome.runtime.lastError
      if (error) {
        console.error(error)
      }
    })
  }

  const handleMinior = (data, newState) => {
    chrome.runtime.sendMessage(
      {
        // 里面的值应该可以自定义，用于判断哪个请求之类的
        type: 'post',
        url: configApi + '/api/index/addProductMonitor', // 需要请求的url
        data: {
          token: userinfo.userinfo.token,
          accountId: userinfo.userinfo.id,
          asin: data.asin,
          country: data.country,
        },
      },
      (json) => {
        if (json.code === 403) {
          // 超过查询次数
          setModal(true)
        } else {
          setOpen(true)
          setMsg(json.msg)
        }
      },
    )
  }
  const handleFresh = () => {
    setLoading(false)
    // setLoading(false)
    getTableList()
    // setTimeout(() => {
    //   setLoading(true)
    // }, 2000)
  }

  const getTableList = () => {
    // 获取列表数据
    getableData()
      .then((res) => {
        setRows(res)
        setLoading(true)

        let length = res.length
        if (!length) {
          setInfo({
            estimatedSales: '暂无数据',
            estimatedDaySales: '暂无数据',
            price: '暂无数据',
            net: '暂无数据',
            estRevenue: '暂无数据',
          })
          setEmpty(true)
          return
        }
        let estimatedSales = 0
        let estimatedDaySales = 0
        let price = 0
        let net = 0
        let estRevenue = 0
        res.map((item) => {
          estimatedSales += Number(item.estimatedSales)
          estimatedDaySales += Number(item.estimatedDaySales)
          price += Number(item.price)
          net += Number(item.net)
          estRevenue += Number(item.estRevenue)
        })
        setInfo({
          estimatedSales: (estimatedSales / length).toFixed(2),
          estimatedDaySales: (estimatedDaySales / length).toFixed(2),
          price: (price / length).toFixed(2),
          net: (net / length).toFixed(2),
          estRevenue: (estRevenue / length).toFixed(2),
        })
      })
      .catch((err) => {
        console.log('-------------')
        console.log(err)
        if (!err || err.code === 401) {
          // handleLogin(false)
          handleExit()
        } else {
          // handleExit()
        }
      })
  }
  useEffect(() => {
    chrome.storage.local.get(['testinfo'], function (result) {
      // console.log('--------------')
      // console.log(result)
      if (result.testinfo) {
        setUserinfo(result.testinfo)
      }
    })
    getTableList()
  }, [url])
  return (
    <Fragment>
      <Draggable disabled={disabled}>
        <div className={`extension-wrap ${disabled ? 'wrap-disabled' : 'wrap-dragable'}`}>
          <div className="table-wrap">
            <div className="ext-title">
              <div className="ext-l">
                {userinfo && userinfo.userinfo.nickname}
                <i>
                  <PersonIcon className="a-cursor" color="#fff" fontSize="small" />
                </i>
                <span onClick={handleExit}>退出</span>
              </div>
              <div className="ext-m">
                <img className="title-logo" src="http://h5.57xg.com/logoxg.png" alt="" />
              </div>
              <div className="ext-r">
                <span
                  className="icon-item"
                  onClick={() => {
                    handleFresh()
                  }}
                >
                  <AutorenewIcon className="a-cursor" color="#fff" />
                </span>
                <span
                  className="icon-item icon-item-2"
                  onClick={() => {
                    setDisabled(!disabled)
                  }}
                >
                  <FilterNoneIcon className="a-cursor" color="#fff" fontSize="small" />
                </span>
                <span className="icon-item">
                  <CloseIcon className="a-cursor" onClick={handleClose} color="#fff" />
                </span>
              </div>
            </div>

            <TableContainer component={Paper} sx={{ maxHeight: 640 }}>
              <div className="box-wrap">
                <div className="box-item">
                  <div className="box-title">平均月销量</div>
                  <div className="box-info">
                    {!loading ? <Skeleton height={20} /> : info.estimatedSales}
                  </div>
                </div>
                <div className="box-item">
                  <div className="box-title">平均日销量</div>
                  <div className="box-info">
                    {!loading ? <Skeleton height={20} /> : info.estimatedDaySales}
                  </div>
                </div>

                <div className="box-item">
                  <div className="box-title">平均售价</div>
                  <div className="box-info">{!loading ? <Skeleton height={20} /> : info.price}</div>
                </div>

                <div className="box-item">
                  <div className="box-title">平均净利润</div>
                  <div className="box-info">{!loading ? <Skeleton height={20} /> : info.net}</div>
                </div>

                <div className="box-item">
                  <div className="box-title">平均月收入</div>
                  <div className="box-info">
                    {!loading ? <Skeleton height={20} /> : info.estRevenue}
                  </div>
                </div>
              </div>
              <Table className="table-root" sx={{ minWidth: 650 }} aria-label="sticky table">
                {/* <TableHead className="table-wrap-head">
            <TableRow>
              <TableCell align="center">名称</TableCell>
              <TableCell align="center">月销量</TableCell>
              <TableCell align="center">日销量</TableCell>
              <TableCell align="center">售价</TableCell>
              <TableCell align="center">净利润</TableCell>
              <TableCell align="center">月收入</TableCell>
              <TableCell align="center">星级</TableCell>
              <TableCell align="center">上架时间</TableCell>
            </TableRow>
          </TableHead> */}
                <EnhancedTableHead
                  order={order}
                  orderBy={orderBy}
                  onRequestSort={handleRequestSort}
                  rowCount={rows.length}
                />
                <TableBody>
                  {/* stableSort(rows, getComparator(order, orderBy)).map((row, index) */}
                  {/* {empty && (
                    <div>
                      <Alert severity="info">暂未抓取数据</Alert>
                    </div>
                  )} */}
                  {rows.length && loading ? (
                    stableSort(rows, getComparator(order, orderBy)).map((row, index) => {
                      return (
                        <TableRow
                          key={index}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <TableCell align="center">
                            <div className="cell-wrap cell-wrap-1">
                              <a
                                href={`https://www.jindy123.com/-/zh/dp/${row.asin}`}
                                target="_blank"
                              >
                                <img src={row.imageUrl} alt="" />
                              </a>
                              <div className="cell-desc">
                                <div>
                                  <a
                                    href={`https://www.jindy123.com/-/zh/dp/${row.asin}`}
                                    target="_blank"
                                  >
                                    {row.name}
                                  </a>
                                </div>
                                <p>
                                  <a
                                    href={`https://www.jindy123.com/-/zh/dp/${row.asin}`}
                                    target="_blank"
                                  >
                                    {row.asin}
                                  </a>
                                  <i>
                                    <VoiceChatIcon color="#0560e5"></VoiceChatIcon>
                                  </i>
                                  <span
                                    onClick={() => {
                                      handleMinior(row)
                                    }}
                                  >
                                    监控
                                  </span>
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell align="center">{row.estimatedSales}</TableCell>
                          <TableCell align="center">{row.estimatedDaySales}</TableCell>
                          <TableCell align="center">{row.price}</TableCell>
                          <TableCell align="center">{Number(row.net).toFixed(2)}</TableCell>
                          <TableCell align="center">{row.estRevenue}</TableCell>
                          <TableCell align="center">
                            {row.rating}
                            {/* <Stack spacing={1}>
                          <Rating
                            name="half-rating-read"
                            defaultValue={Number(row.rating)}
                            precision={0.5}
                            readOnly
                          />
                        </Stack> */}
                          </TableCell>
                          <TableCell align="center">{row.listedAtDate}</TableCell>
                        </TableRow>
                      )
                    })
                  ) : (
                    <TableRow>
                      <TableCell align="right" colSpan={8} rowSpan={3}>
                        <Box sx={{ width: '100%' }}>
                          {[1, 2, 3].map((item) => (
                            <div key={item}>
                              <Skeleton height={50} />
                              <Skeleton height={50} animation="wave" />
                              <Skeleton height={50} animation={false} />
                            </div>
                          ))}
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      </Draggable>
      <Modal
        open={modal}
        onClose={handleModal}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div className="modal-wrap">
          <div className="modal-desc">
            监控数量已达上限 <br /> 升级会员立即提升监控数量
          </div>
          <div className="button-wrap">
            <div
              className="modal-button modal-button-1"
              onClick={() => {
                setModal(false)
              }}
            >
              取消
            </div>
            <a className="modal-button" href={configApi + '/#/vip'} target="_blank">
              升级会员
            </a>
          </div>
        </div>
      </Modal>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={open}
        autoHideDuration={4000}
        onClose={miniorClose}
        message={msg}
      />
    </Fragment>
  )
}
