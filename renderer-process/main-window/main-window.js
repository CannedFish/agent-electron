const ipc = require('electron').ipcRenderer

const selfSection = document.getElementById('main-window')
const fileSearchInput = document.getElementById('main-file-search')
const fileUploadBtn = document.getElementById('main-file-upload')
const fileDownloadBtn = document.getElementById('main-file-download')
const fileNewBtn = document.getElementById('main-file-new')
const fileMoreBtn = document.getElementById('main-file-more')

fileUploadBtn.addEventListener('click', (evt) => {
  console.log("upload file")
})

fileDownloadBtn.addEventListener('click', (evt) => {
  console.log("download file")
})

fileNewBtn.addEventListener('click', (evt) => {
  console.log("new file")
})

fileMoreBtn.addEventListener('click', (evt) => {
  console.log("more")
})

selfSection.classList.add('is-shown')

