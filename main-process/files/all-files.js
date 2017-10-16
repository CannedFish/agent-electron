const ipc = require('electron').ipcMain

const r_api = require('./remote-api')

ipc.on('get-files', (evt, parentPath) => {
  r_api.getFileList(parentPath, (err, files) => {
    if(err != null) {
      console.log(err)
      return 
    }

    // fileTree.update(files)
    evt.sender.send('get-files-reply', files.map((f) => {
      return f.toString()
    }))
  })
})

