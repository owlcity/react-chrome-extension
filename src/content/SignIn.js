import React, { useState } from 'react'
import Container from '@material-ui/core/Box'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
export default function SignIn(props) {
  const { handleLogin } = props
  const [open, setOpen] = useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }
  const handleSubmit = (event) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    // eslint-disable-next-line no-console
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    })
    // return
    chrome.runtime.sendMessage(
      {
        // 里面的值应该可以自定义，用于判断哪个请求之类的
        type: 'post',
        url: ' https://amz.demo.57xg.com/api/user/login', // 需要请求的url
        data: {
          account: data.get('email'),
          password: data.get('password'),
        },
      },
      (res) => {
        if (!res.code) {
          handleClickOpen()
        } else {
          chrome.storage.local.set({ login: true }, function () {
            console.log('Value is set to ' + value)
          })
          handleLogin(true)
        }
      },
    )
  }

  return (
    <div>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="账号"
              name="email"
              autoComplete="email"
              autoFocus
              size="small"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="密码"
              type="password"
              id="password"
              size="small"
              autoComplete="current-password"
            />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              登陆
            </Button>
            <Grid container>
              <Grid item xs>
                <a href="https://amz.demo.57xg.com/" target="_blank">
                  忘记密码
                </a>
              </Grid>
              <Grid item>
                <a href="https://amz.demo.57xg.com/" target="_blank">
                  注册
                </a>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'提示'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">账号或密码错误</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" autoFocus>
            确认
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
