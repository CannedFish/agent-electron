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
const uploadIcon = document.getElementById("icon-upload")

const FileIcon = require(__dirname + '/file-icon')
const fileExplore = document.getElementById('file-explore')

document.addEventListener('dragenter', (evt) => {
  evt.preventDefault()
})

document.addEventListener('dragover', (evt) => {
  evt.preventDefault()
})

document.addEventListener('drop', (evt) => {
  evt.stopPropagation()
  evt.preventDefault()
})

uploadIcon.addEventListener('click', (evt) => {
  evt.stopPropagation()
  uploadArea.classList.add("is-shown")
})

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

let uploadFile = null
const uploadTip = uploadArea.querySelector('.tip')
const origTip = "拖拽至此上传或点击上传"

uploadAreaUploadBtn.addEventListener('click', (evt) => {
  ipc.send('upload', uploadFile, cur)
  uploadArea.classList.remove("is-shown")
  uploadTip.innerHTML = origTip
  uploadFile = null
})

uploadAreaCancelBtn.addEventListener('click', (evt) => {
  uploadArea.classList.remove("is-shown")
  uploadTip.innerHTML = origTip
  uploadFile = null
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
  uploadFile = {
    name: dt.files[0].name,
    size: dt.files[0].size,
    type: dt.files[0].type,
    path: dt.files[0].path
  }
  uploadTip.innerHTML = uploadFile.path
})

selfSection.classList.add('is-shown')

let fileIconList = {}
let cur = null

ipc.on('get-files-reply', (evt, files, curPath) => {
  for(let k in fileIconList) {
    fileIconList[k].destroy()
  }

  fileIconList = {}
  files.map((fileobj) => {
    let fileIcon = new FileIcon(fileobj.type, fileobj.name, fileExplore, fileobj)
    fileIcon.show()
    fileIconList[fileobj.name] = fileIcon
  })

  cur = curPath
})

ipc.send('get-files', '/', true)

