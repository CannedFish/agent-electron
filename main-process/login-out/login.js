const path = require('path')
const electron = require('electron')
const BrowserWindow = electron.BrowserWindow
const ipc = electron.ipcMain
const settings = require('electron-settings')

const common = require(__dirname + '/../../common.js')

const debug = /--debug/.test(process.argv[2])

var loginWindow = null
var after_login = null

let repwd = settings.get('remember-password', false)
let autologin = settings.get('auto-login', false)

ipc.on('login', function(event, arg) {
  console.log('login info:', arg)
  info = arg.split('#')
  login(info[0], info[1], (err) => {
    if(err) {
      event.sender.send('login-reply', 'failed with some reason')
    } else {
      event.sender.send('login-reply', null)
      /* if(repwd) { */
        // settings.set('remember-password', repwd)
        // settings.set('username', usr)
        // settings.set('password', pwd)
      // }
      // if(autologin) {
        // settings.set('auto-login', autologin)
      /* } */
      loginWindow.hide()
      after_login(null, loginWindow, info[0])
    }
  })
}).on('re-usr', (event, arg) => {
  // handle the event of remember username
  repwd = arg
}).on('auto-login', (event, arg) => {
  // handle the event of auto login
  autologin = arg
}).on('checkbox-state', (evt) => {
  evt.sender.send('checkbox-state-reply', isRemember(), isAutoLogin())
})

function login(usr, pwd, callback) {
  // 1. Get auth_url and tenant_name from sqlite3
  // 2. post /api/authenticate to get token
  common.getTenantInfo((err, auth_url, tenant_name) => {
    if(err) {
      return callback(err)
    }
    let cb = callback
    common.authenticate(usr, pwd, auth_url, tenant_name, (err, token) => {
      console.log('auth_token:', token)
      return cb(err)
    })
  })
}
// exports.login = login

function isLogin() {
  return true
}
exports.isLogin = isLogin

function isRemember() {
  return repwd
}
// exports.isRemember = isRemember

function isAutoLogin() {
  return autologin
}
// exports.isAutoLogin = isAutoLogin

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

