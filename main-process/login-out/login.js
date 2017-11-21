const path = require('path')
const electron = require('electron')
const BrowserWindow = electron.BrowserWindow
const ipc = electron.ipcMain

const common = require(__dirname + '/../../common.js')

const debug = /--debug/.test(process.argv[2])

var loginWindow = null
var after_login = null

ipc.on('login', function(event, arg) {
  console.log('login info:', arg)
  login((err) => {
    if(err) {
      event.sender.send('login-reply', 'failed with some reason')
    } else {
      event.sender.send('login-reply', null)
      loginWindow.hide()
      after_login(null, loginWindow)
    }
  })
}).on('re-usr', (event, arg) => {
  // TODO: handle the event of remember username
}).on('auto-login', (event, arg) => {
  // TODO: handle the event of auto login
})

function login(usr, pwd, callback) {
  // TODO:
  //   1. Get auth_url and tenant_name from sqlite3
  //   2. post /api/authenticate to get token
  common.getTenantInfo((err, auth_url, tenant_name) {
    if(err) {
      return callback(err)
    }
    common.authenticate(usr, pwd, auth_url, tenant_name, (err, token) => {
      console.log('auth_token:', token)
      return callback(err)
    })
  })
}
// exports.login = login

function isLogin() {
  return true
}
exports.isLogin = isLogin

function isRemember() {
  return true
}
exports.isRemember = isRemember

function isAutoLogin() {
  return true
}
exports.isAutoLogin = isAutoLogin

function create(win_title, callback) {
  after_login = callback

  var windowOptions = {
    width: 440,
    height: 360,
    center: true,
    resizable: false,
    maximizable: false,
    fullscreenable: false,
    autoHideMenuBar: true,
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
    after_login = null
  })
}
exports.create = create

