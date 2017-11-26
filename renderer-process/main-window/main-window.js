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
  let icon_selected = fileExplore.querySelector('.is-selected')
  let icon_name = icon_selected.querySelector('.icon-txt').innerHTML
  // let fileInfo = fileIconList[icon_name].fileInfo()
  ipc.send('download-show', fileIconList[icon_name].fileInfo())
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

let uploadFilePath = null
const uploadTip = uploadArea.querySelector('.tip')
const origTip = "拖拽至此上传或点击上传"

uploadAreaUploadBtn.addEventListener('click', (evt) => {
  uploadArea.classList.remove("is-shown")
  uploadTip.innerHTML = origTip
  uploadFilePath = null
})

uploadAreaCancelBtn.addEventListener('click', (evt) => {
  uploadArea.classList.remove("is-shown")
  uploadTip.innerHTML = origTip
  uploadFilePath = null
})

fileExplore.addEventListener('click', (evt) => {
  let icons = fileExplore.querySelectorAll('.file-icon')
  Array.prototype.map.call(icons, (icon) => {
    icon.classList.remove('is-selected')
  })
})

uploadArea.addEventListener('drop', (evt) => {
  evt.stopPropagation()
  evt.preventDefault()

  let dt = evt.dataTransfer
  uploadFilePath = dt.files[0]
  uploadTip.innerHTML = uploadFilePath
})

selfSection.classList.add('is-shown')

let fileIconList = {}

ipc.on('get-files-reply', (evt, files) => {
  for(let k in fileIconList) {
    fileIconList[k].destroy()
  }

  fileIconList = {}
  files.map((fileobj) => {
    let fileIcon = new FileIcon(fileobj.type, fileobj.name, fileExplore, fileobj)
    fileIcon.show()
    fileIconList[fileobj.name] = fileIcon
  })
})

ipc.send('get-files', '.', true)

