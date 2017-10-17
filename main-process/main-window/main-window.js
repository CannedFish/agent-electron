const path = require('path') 
const electron = require('electron')

const BrowserWindow = electron.BrowserWindow

const debug = /--debug/.test(process.argv[2])

var mainWindow = null

function create(windowName) {
  var windowOptions = {
    width: 1080,
    minWidth: 680,
    height: 840,
    autoHideMenuBar: true,
    title: windowName
  }

  if (process.platform === 'linux') {
    windowOptions.icon = path.join(__dirname, '../../assets/app-icon/png/512.png')
  }

  mainWindow = new BrowserWindow(windowOptions)
  mainWindow.loadURL(path.join('file://', __dirname, '../../index.html'))

  // Launch fullscreen with DevTools open, usage: npm run debug
  if (debug) {
    mainWindow.webContents.openDevTools()
    mainWindow.maximize()
    require('devtron').install()
  }

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}
exports.create = create

function close() {
  mainWindow.close()
}
exports.close = close

function hide() {
  mainWindow.hide()
}
exports.hide = hide

