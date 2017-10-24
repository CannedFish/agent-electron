const ipc = require('electron').ipcRenderer

const selfSection = document.getElementById('trans-list')
const mainWindowToggleBtn = document.getElementById('to-main-window')
const uploadingTabBtn = document.getElementById('uploading')
const downloadingTabBtn = document.getElementById('downloading')
const completedTabBtn = document.getElementById('completed')
const tabList = [uploadingTabBtn, downloadingTabBtn, completedTabBtn]

mainWindowToggleBtn.addEventListener('click', (evt) => {
  selfSection.classList.remove('is-shown')
  document.getElementById('main-window').classList.add('is-shown')
})

function unselectedAllTab() {
  tabList.map((tab) => {
    tab.classList.remove("is-selected")
  })
}

uploadingTabBtn.addEventListener('click', (evt) => {
  unselectedAllTab()
  uploadingTabBtn.classList.add("is-selected")
})

downloadingTabBtn.addEventListener('click', (evt) => {
  unselectedAllTab()
  downloadingTabBtn.classList.add("is-selected")
})

completedTabBtn.addEventListener('click', (evt) => {
  unselectedAllTab()
  completedTabBtn.classList.add("is-selected")
})

uploadingTabBtn.classList.add("is-selected")

