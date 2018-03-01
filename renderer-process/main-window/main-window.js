const ipc = require('electron').ipcRenderer

const userNameDiv = document.querySelector('.nav-header-usr')
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
  if(cur == '/') {
    alert("当前目录不允许上传文件")
  } else {
    uploadArea.classList.add("is-shown")
  }
})

fileDownloadBtn.addEventListener('click', (evt) => {
  console.log("download file")
  let icon_selected = fileExplore.querySelector('.is-selected')
  if(icon_selected != null) {
    let icon_name = icon_selected.querySelector('.icon-txt').innerHTML
    let fileInfo = fileIconList[icon_name].fileInfo()
    if(fileInfo.type == 0) {
      alert("当前不支持文件夹下载")
    } else {
      ipc.send('download-show', fileInfo)
    }
  } else {
    alert('请先选择要下载的文件')
  }
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
  if(uploadFile == null) {
    alert("未指定需要上传的文件")
  } else {
    ipc.send('upload', uploadFile, cur)
    uploadArea.classList.remove("is-shown")
    uploadTip.innerHTML = origTip
    uploadFile = null
  }
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

fileSearchInput.addEventListener('input', (e) => {
  e.stopPropagation()

  let target = fileSearchInput.value
  for(let k in fileIconList) {
    k.includes(target) ? fileIconList[k].showFromHidden() : fileIconList[k].hide()
  }
})

selfSection.classList.add('is-shown')

let fileIconList = {}
let cur = null

ipc.on('get-usr-reply', (evt, usrName) => {
  userNameDiv.innerHTML = usrName
}).on('get-files-reply', (evt, files, curPath) => {
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
  if(cur == '/') {
    uploadIcon.classList.add('is-hidden')
  } else {
    uploadIcon.classList.remove('is-hidden')
  }
}).on('upload-complete', (evt) => {
  ipc.send('get-files', cur, cur=='/')
}).on('upload-err', (evt, fileInfo, err) => {
  alert(`${fileInfo.name}上传失败：\n${err}`)
})

ipc.send('get-usr')
ipc.send('get-files', '/', true)

