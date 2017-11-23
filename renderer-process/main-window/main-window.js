const ipc = require('electron').ipcRenderer

const selfSection = document.getElementById('main-window')
const fileSearchInput = document.getElementById('main-file-search')
const fileUploadBtn = document.getElementById('main-file-upload')
const fileDownloadBtn = document.getElementById('main-file-download')
const fileNewBtn = document.getElementById('main-file-new')
const fileMoreBtn = document.getElementById('main-file-more')
const transListToggleBtn = document.getElementById('to-trans-list')

const uploadArea = document.getElementById("upload-area")
const uploadAreaUploadBtn = document.getElementById("upload-area-upload")
const uploadAreaCancelBtn = document.getElementById("upload-area-cancel")

const FileIcon = require(__dirname + '/file-icon')
const fileExplore = document.getElementById('file-explore')

fileUploadBtn.addEventListener('click', (evt) => {
  console.log("upload file")
  uploadArea.classList.add("is-shown")
})

fileDownloadBtn.addEventListener('click', (evt) => {
  console.log("download file")
  ipc.send('download-show') // TODO: filename, filetype, filesize
})

fileNewBtn.addEventListener('click', (evt) => {
  console.log("new file")
})

fileMoreBtn.addEventListener('click', (evt) => {
  console.log("more")
})

transListToggleBtn.addEventListener('click', (evt) => {
  selfSection.classList.remove('is-shown')
  document.getElementById("trans-list").classList.add('is-shown')
})

uploadAreaUploadBtn.addEventListener('click', (evt) => {
})

uploadAreaCancelBtn.addEventListener('click', (evt) => {
  uploadArea.classList.remove("is-shown")
})

selfSection.classList.add('is-shown')

ipc.on('get-files-reply', (evt, files) => {
  files.map((filename) => {
    let fileIcon = new FileIcon(1, filename, fileExplore)
    fileIcon.show()
  })
})

ipc.send('get-files', '.')

