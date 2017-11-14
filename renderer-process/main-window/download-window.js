const ipc = require('electron').ipcRenderer

const pathBtn = document.getElementById('path-btn')
const downloadBtn = document.getElementById('download-btn')
const cancelBtn = document.getElementById('cancel-btn')

const downloadPath = document.getElementById('download-path')

pathBtn.addEventListener('click', (evt) => {
  ipc.send('download-path')
})

downloadBtn.addEventListener('click', (evt) => {
})

cancelBtn.addEventListener('click', (evt) => {
  ipc.send('download-cancel')
})

ipc.on('download-path-reply', (evt, path) => {
  console.log(path)
  downloadPath.value = path
  downloadPath.title = path
})

