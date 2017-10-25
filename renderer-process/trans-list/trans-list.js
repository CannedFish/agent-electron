const ipc = require('electron').ipcRenderer

const selfSection = document.getElementById('trans-list')
const mainWindowToggleBtn = document.getElementById('to-main-window')

const uploadingTabBtn = document.getElementById('uploading')
const downloadingTabBtn = document.getElementById('downloading')
const completedTabBtn = document.getElementById('completed')
const tabBtnList = [uploadingTabBtn, downloadingTabBtn, completedTabBtn]

const uploadingTab = document.getElementById("tab-upload")
const downloadingTab = document.getElementById("tab-download")
const completedTab = document.getElementById("tab-completed")
const tabList = [uploadingTab, downloadingTab, completedTab]

const startAllBtn = document.getElementById("trans-list-start")
const endAllBtn = document.getElementById("trans-list-end")
const clearAllBtn = document.getElementById("trans-list-clear")
const ctrlBtns = [startAllBtn, endAllBtn, clearAllBtn]

mainWindowToggleBtn.addEventListener('click', (evt) => {
  selfSection.classList.remove('is-shown')
  document.getElementById('main-window').classList.add('is-shown')
})

function unselectedAllTab() {
  tabList.map((tab) => {
    tab.classList.remove("is-shown")
  })
  tabBtnList.map((btn) => {
    btn.classList.remove("is-selected")
  })
  ctrlBtns.map((btn) => {
    btn.classList.remove("is-shown")
  })
}

uploadingTabBtn.addEventListener('click', (evt) => {
  unselectedAllTab()
  uploadingTabBtn.classList.add("is-selected")
  uploadingTab.classList.add("is-shown")
  startAllBtn.classList.add("is-shown")
  endAllBtn.classList.add("is-shown")
})

downloadingTabBtn.addEventListener('click', (evt) => {
  unselectedAllTab()
  downloadingTabBtn.classList.add("is-selected")
  downloadingTab.classList.add("is-shown")
  startAllBtn.classList.add("is-shown")
  endAllBtn.classList.add("is-shown")
})

completedTabBtn.addEventListener('click', (evt) => {
  unselectedAllTab()
  completedTabBtn.classList.add("is-selected")
  completedTab.classList.add("is-shown")
  clearAllBtn.classList.add("is-shown")
})

uploadingTabBtn.click()

