import React, { Fragment, useState } from 'react'
import CloseIcon from '@material-ui/icons/Close'
import Button from '@material-ui/core/Button'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import { configApi } from '../config'
export default function SignIn(props) {
  const { closeExt, handleLogin } = props
  const [open, setOpen] = useState(false)
  const [fullWidth, setFullWidth] = useState(true)
  const [checked, setChecked] = useState(true)
  const [maxWidth, setMaxWidth] = useState('sm')
  const [account, setAccount] = useState('')
  const [password, setPassword] = useState('')

  const handleClickOpen = () => {
    setOpen(true)
  }
  const handleAccount = (e) => {
    setAccount(e.target.value)
  }
  const handlePassword = (e) => {
    setPassword(e.target.value)
  }

  const handleClose = () => {
    setOpen(false)
  }
  const handleSubmit = (event) => {
    // event.preventDefault()
    // const data = new FormData(event.currentTarget)
    // eslint-disable-next-line no-console
    chrome.runtime.sendMessage(
      {
        // 里面的值应该可以自定义，用于判断哪个请求之类的
        type: 'post',
        url: configApi + '/api/user/login', // 需要请求的url
        data: {
          account: account,
          password: password,
        },
      },
      function (json) {
        if (!json.code) {
          handleClickOpen()
        } else {
          chrome.storage.local.set({ login: true }, function () {
            // console.log('login status ' + JSON.stringify(json))
          })
          chrome.storage.local.set({ testinfo: json.data }, function () {
            // console.log('userinfo' + JSON.stringify(json))
          })
          handleLogin(true)
        }
      },
    )
  }

  return (
    <Fragment>
      <div className="login-wrap">
        <div className="login-title">
          <img className="title-logo" src="http://h5.57xg.com/logoxg.png" alt="" />
          <span
            className="close-icon"
            onClick={() => {
              closeExt()
            }}
          >
            <CloseIcon color="#fff"></CloseIcon>
          </span>
        </div>
        <div className="login-con">
          <div className="login-h2">账号登陆</div>
          <input
            className="login-input"
            onChange={handleAccount}
            type="text"
            placeholder="请输入账号"
          />
          <input
            onChange={handlePassword}
            className="login-input"
            type="password"
            placeholder="请输入密码"
          />
          <div className="login-info">
            <a href="https://amz.57xg.com/" target="_blank">
              忘记密码
            </a>
            <FormControlLabel
              control={
                <Checkbox
                  checked={checked}
                  onChange={() => {
                    setChecked(!checked)
                  }}
                />
              }
              label="记住密码"
            />
          </div>
          <div className="login-button" onClick={handleSubmit}>
            登陆
          </div>
          <div className="login-desc">
            还没有账号?
            <a href="https://amz.57xg.com/" target="_blank">
              免费注册
            </a>
          </div>
        </div>
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'提示'}</DialogTitle>
        <DialogContent className="dialog-con">
          <DialogContentText id="alert-dialog-description">账号或密码错误</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" autoFocus>
            确认
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  )
}
