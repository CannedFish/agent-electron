const path = require('path') 
const fs = require('fs') 
const uuidv1 = require('uuid/v1')
const electron = require('electron')
const BrowserWindow = electron.BrowserWindow
const ipc = electron.ipcMain

const common = require(path.join(__dirname, '../../common.js'))

const debug = /--debug/.test(process.argv[2])

var mainWindow = null
var usrName = null

function create(windowName, usr) {
  usrName = usr
  var windowOptions = {
    width: 1280,
    minWidth: 680,
    height: 850,
    resizable: false,
    maximizable: false,
    fullscreenable: false,
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
    require('devtron').install()
  }

  mainWindow.on('closed', function () {
    mainWindow = null
    usrName = null
  })

  mainWindow.webContents.on('will-navigate', (evt) => {
    evt.preventDefault()
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

function instance() {
  return mainWindow
}
exports.instance = instance

ipc.on('get-usr', (evt) => {
  evt.sender.send('get-usr-reply', usrName)
}).on('get-files', (evt, cur, dir) => {
  console.log(cur, dir)
  if(dir) {
    common.getContainers((err, rets) => {
      // console.log('get containers return', rets)
      evt.sender.send('get-files-reply', rets, cur)
    })
  } else {
    common.getObjects(cur, (err, rets) => {
      evt.sender.send('get-files-reply', rets, cur)
    })
  }
}).on('upload', (evt, uploadFile, cur) => {
  let uploadSessionId = uuidv1()
  evt.sender.send('uploading'
    , 1
    , uploadFile.name
    , uploadFile.size
    , uploadSessionId
  )

  common.uploadObject(uploadFile.path, uploadFile.size, cur, (err, objectInfo) => {
    if(err) {
      return evt.sender.send('upload-err', {
        name: uploadFile.name,
        type: 1,
        size: uploadFile.size
      }, err, uploadSessionId)
    }
    return evt.sender.send('upload-complete', 1, uploadFile.name, uploadFile.size
      , (new Date).toLocaleDateString().replace(/\//g, '-')
      , uploadSessionId
    )
  })
})
