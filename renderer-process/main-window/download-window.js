const ipc = require('electron').ipcRenderer

const pathBtn = document.getElementById('path-btn')
const downloadBtn = document.getElementById('download-btn')
const cancelBtn = document.getElementById('cancel-btn')

const downloadPath = document.getElementById('download-path')

const fileIcon = document.querySelector('.file-icon')
const fileName = document.querySelector('.file-name')
const fileSize = document.querySelector('.file-size')

let fileSelected = null

const iconString = [
  '<use xlink:href="#icon-wenjianjia"></use>',
  '<use xlink:href="#icon-wendang"></use>',
  '<use xlink:href="#icon-tupian"></use>',
  '<use xlink:href="#icon-shipin"></use>'
]

pathBtn.addEventListener('click', (evt) => {
  ipc.send('download-path')
})

downloadBtn.addEventListener('click', (evt) => {
  ipc.send('download', fileSelected)
})

cancelBtn.addEventListener('click', (evt) => {
  ipc.send('download-cancel')
})

ipc.on('download-show-reply', (evt, fileobj) => {
  // change file infomation
  console.log(fileobj)
  fileIcon.innerHTML = iconString[fileobj.type]
  fileName.innerHTML = fileobj.name
  fileSize.innerHTML = fileobj.size
  fileSelected = fileobj
}).on('download-path-reply', (evt, path) => {
  console.log(path)
  downloadPath.value = path
  downloadPath.title = path
})

