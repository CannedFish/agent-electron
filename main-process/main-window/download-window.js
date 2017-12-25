const path = require('path') 
const electron = require('electron')
const BrowserWindow = electron.BrowserWindow
const ipc = electron.ipcMain
const dialog = electron.dialog
const uuidv1 = require('uuid/v1')

const debug = /--debug/.test(process.argv[2])

const common = require(path.join(__dirname, '../../common.js'))

var downloadWindow = null

function instance() {
  if(downloadWindow == null) {
    const mainWin = require(path.join(__dirname, 'main-window.js')).instance()
    downloadWindow = new BrowserWindow({
      width: 480,
      height: 180,
      parent: mainWin,
      modal: true,
      autoHideMenuBar: true,
      show: false,
      minimizable: false,
      maximizable: false,
      resizable: false,
      alwaysOnTop: true
    })
    downloadWindow.loadURL(path.join('file://', __dirname
      , '../../sections/main-window/download-window.html'))
    downloadWindow.on('closed', () => {
      downloadWindow = null
    })

    if (debug) {
      downloadWindow.webContents.openDevTools()
      require('devtron').install()
    }
  }
  return downloadWindow
}

ipc.on('download-show', (evt, fileobj) => {
  let win = instance()
  win.once('ready-to-show', () => {
    win.show()
  }).once('show', (event) => {
    event.sender.send('download-show-reply', fileobj)
  })
}).on('download-cancel', (evt) => {
  downloadWindow.close()
}).on('download-path', (evt) => {
  dialog.showOpenDialog({
    properties: ['openDirectory'],
    title: "请选择下载路径"
  }, (download_path) => {
    console.log(download_path)
    evt.sender.send('download-path-reply', download_path[0])
  })
}).on('download', (evt, fileobj, download_to) => {
  // generate a download session ID
  let downloadSessionId = uuidv1()
  let parentWin = downloadWindow.getParentWindow()
  parentWin.webContents.send('downloading', fileobj.type, fileobj.name, fileobj.size, downloadSessionId)
  common.downloadObject(fileobj.container, fileobj.name, path.join(download_to, fileobj.name), (err) => {
    if(err) {
      return parentWin.webContents.send('download-err', fileobj, err)
    }
    return parentWin.webContents.send('download-complete'
      , fileobj.type, fileobj.name, fileobj.size
      , (new Date).toLocaleDateString().replace(/\//g, '-')
      , downloadSessionId)
  })
  downloadWindow.close()
})

