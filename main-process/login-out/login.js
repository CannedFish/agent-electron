const ipc = require('electron').ipcMain

ipc.on('login', function(event, arg) {
  console.log('login info:', arg)
  event.sender.send('login-reply', 'ok')
})

