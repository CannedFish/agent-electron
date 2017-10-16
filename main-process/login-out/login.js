const BrowserWindow = electron.BrowserWindow

const ipc = require('electron').ipcMain

ipc.on('login', function(event, arg) {
  console.log('login info:', arg)
  if(login()) {
    event.sender.send('login-reply', null)
  } else {
    event.sender.send('login-reply', 'failed with some reason')
  }
}).on('re-usr', (event, arg) => {
  // TODO: handle the event of remember username
}).on('auto-login', (event, arg) => {
  // TODO: handle the event of auto login
})

function login(usr, pwd) {
  return true
}
export.login = login

function isRemember() {
  return true
}
export.isRemember = isRemember

function isAutoLogin() {
  return true
}
export.isAutoLogin = isAutoLogin

function main(win_title) {
  var windowOptions = {
    width: 680,
    height: 840,
    title: win_title
  }
  
  if (process.platform === 'linux') {
    windowOptions.icon = path.join(__dirname, '../../assets/app-icon/png/512.png')
  }

  loginWindow = new BrowserWindow(windowOptions)
  loginWindow.loadURL(path.join('file://', __dirname, '../../sections/login-out/login.html'))

  if (debug) {
    loginWindow.webContents.openDevTools()
    loginWindow.maximize()
    require('devtron').install()
  }

  loginWindow.on('closed', () => {
    loginWindow = null
  })
}
export.main = main

