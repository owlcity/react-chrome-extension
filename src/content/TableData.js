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
    label: '??????',
  },
  {
    id: 'estimatedSales',
    numeric: true,
    label: '?????????',
  },
  {
    id: 'estimatedDaySales',
    numeric: true,
    label: '?????????',
  },
  {
    id: 'price',
    numeric: true,
    label: '??????',
  },
  {
    id: 'net',
    numeric: true,
    label: '?????????',
  },
  {
    id: 'estRevenue',
    numeric: true,
    label: '?????????',
  },
  {
    id: 'rating',
    numeric: true,
    label: '??????',
  },
  {
    id: 'listedAtDate',
    numeric: false,
    label: '????????????',
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
      // ??????????????????bg?????????
      // console.log('------------')
      // console.log('corner---', corner)
      if (request.info === 'url-change') {
        // console.log('----------')
        setLoading(false)
        // document.onload ??????
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
        // ?????????????????????????????????????????????????????????????????????
        type: 'post',
        url: configApi + '/api/index/addProductMonitor', // ???????????????url
        data: {
          token: userinfo.userinfo.token,
          accountId: userinfo.userinfo.id,
          asin: data.asin,
          country: data.country,
        },
      },
      (json) => {
        if (json.code === 403) {
          // ??????????????????
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
    // ??????????????????
    getableData()
      .then((res) => {
        setRows(res)
        setLoading(true)

        let length = res.length
        if (!length) {
          setInfo({
            estimatedSales: '????????????',
            estimatedDaySales: '????????????',
            price: '????????????',
            net: '????????????',
            estRevenue: '????????????',
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
                <span onClick={handleExit}>??????</span>
              </div>
              <div className="ext-m">
                <img
                  className="title-logo"
                  src="data:image/png;base64,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"
                  alt=""
                />
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
                  <div className="box-title">???????????????</div>
                  <div className="box-info">
                    {!loading ? <Skeleton height={20} /> : info.estimatedSales}
                  </div>
                </div>
                <div className="box-item">
                  <div className="box-title">???????????????</div>
                  <div className="box-info">
                    {!loading ? <Skeleton height={20} /> : info.estimatedDaySales}
                  </div>
                </div>

                <div className="box-item">
                  <div className="box-title">????????????</div>
                  <div className="box-info">{!loading ? <Skeleton height={20} /> : info.price}</div>
                </div>

                <div className="box-item">
                  <div className="box-title">???????????????</div>
                  <div className="box-info">{!loading ? <Skeleton height={20} /> : info.net}</div>
                </div>

                <div className="box-item">
                  <div className="box-title">???????????????</div>
                  <div className="box-info">
                    {!loading ? <Skeleton height={20} /> : info.estRevenue}
                  </div>
                </div>
              </div>
              <Table className="table-root" sx={{ minWidth: 650 }} aria-label="sticky table">
                {/* <TableHead className="table-wrap-head">
            <TableRow>
              <TableCell align="center">??????</TableCell>
              <TableCell align="center">?????????</TableCell>
              <TableCell align="center">?????????</TableCell>
              <TableCell align="center">??????</TableCell>
              <TableCell align="center">?????????</TableCell>
              <TableCell align="center">?????????</TableCell>
              <TableCell align="center">??????</TableCell>
              <TableCell align="center">????????????</TableCell>
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
                      <Alert severity="info">??????????????????</Alert>
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
                              <a href={`${location.origin}/dp/${row.asin}`} target="_blank">
                                <img src={row.imageUrl} alt="" />
                              </a>
                              <div className="cell-desc">
                                <div>
                                  <a href={`${location.origin}/dp/${row.asin}`} target="_blank">
                                    {row.name}
                                  </a>
                                </div>
                                <p>
                                  <a href={`${location.origin}/dp/${row.asin}`} target="_blank">
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
                                    ??????
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
            ???????????????????????? <br /> ????????????????????????????????????
          </div>
          <div className="button-wrap">
            <div
              className="modal-button modal-button-1"
              onClick={() => {
                setModal(false)
              }}
            >
              ??????
            </div>
            <a className="modal-button" href={configApi + '/#/vip'} target="_blank">
              ????????????
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
