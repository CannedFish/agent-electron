const path = require('path')
const electron = require('electron')
const app = electron.app
const ipc = require('electron').ipcMain

const loginWin = require(path.join(__dirname, '../login-out/login.js'))
const mainWin = require(path.join(__dirname, '../main-window/main-window.js'))

ipc.on('logout', (evt, arg) => {
  if(logout()) {
    evt.sender.send('logout-reply', null)
    mainWin.hide()
    loginWin.create(app.getName(), (err, loginWindow) => {
      if(err != null) {
        console.log(err)
      }
      mainWin.create(app.getName())
      loginWindow.close()
    })
    mainWin.close()
  }
})

function logout() {
  return true
}

