const path = require('path') 
const electron = require('electron')
const BrowserWindow = electron.BrowserWindow
const ipc = electron.ipcMain
const dialog = electron.dialog

const debug = /--debug/.test(process.argv[2])

const mainWin = require(path.join(__dirname, 'main-window.js')).instance()

var downloadWindow = null

function instance() {
  if(downloadWindow == null) {
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

ipc.on('download-show', (evt) => {
  instance().show()
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
})

