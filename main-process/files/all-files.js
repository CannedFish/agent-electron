const ipc = require('electron').ipcMain
const fs = require('fs')

const FileTree = require('./main-process/files/tree').FileTree

let fileTree = new FileTree()

ipc.on('get-files', (evt, arg) => {
  fs.readdir('.', (err, files) => {
    fileTree.update(files)
    evt.sender.send('get-files-reply', fileTree.toString())
  })
})

