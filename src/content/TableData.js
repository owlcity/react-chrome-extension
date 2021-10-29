import React, { useState, useEffect } from 'react'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import Skeleton from '@material-ui/core/Skeleton'
import Box from '@material-ui/core/Box'
import TableSortLabel from '@material-ui/core/TableSortLabel'

import { getableData } from './insertDom'

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein }
}
// 获取tableData

// console.log('---------------')
// console.log(rows)

function descendingComparator(a, b, orderBy) {
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
          <TableCell
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
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}
export default function BasicTable() {
  const [rows, setRows] = useState([])
  const [order, setOrder] = useState('asc')
  const [orderBy, setOrderBy] = useState('name')

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  useEffect(() => {
    getableData().then((res) => {
      setRows(res.data)
    })
  }, [])
  return (
    <div className="table-wrap">
      <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
        <Table className="table-root" stickyHeader sx={{ minWidth: 650 }} aria-label="sticky table">
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
            {rows.length ? (
              stableSort(rows, getComparator(order, orderBy)).map((row, index) => (
                <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell align="center">
                    <div className="cell-wrap">
                      <img src={row.imageUrl} alt="" />
                      <p>{row.name}</p>
                    </div>
                  </TableCell>
                  <TableCell align="center">{row.estimatedSales}</TableCell>
                  <TableCell align="center">{row.estimatedDaySales}</TableCell>
                  <TableCell align="center">{row.price}</TableCell>
                  <TableCell align="center">{row.net}</TableCell>
                  <TableCell align="center">{row.estRevenue}</TableCell>
                  <TableCell align="center">{row.rating}</TableCell>
                  <TableCell align="center">{row.listedAtDate}</TableCell>
                </TableRow>
              ))
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
  )
}
