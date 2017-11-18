const ipc = require('electron').ipcRenderer

const TransListRow = require(__dirname + '/trans-list-row').TransListRow
const CompletedRow = require(__dirname + '/trans-list-row').CompletedRow

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

(function main() {
  mainWindowToggleBtn.addEventListener('click', (evt) => {
    selfSection.classList.remove('is-shown')
    document.getElementById('main-window').classList.add('is-shown')
  })

  uploadingTabBtn.addEventListener('click', (evt) => {
    unselectedAllTab()
    uploadingTabBtn.classList.add("is-selected")
    uploadingTab.classList.add("is-shown")
    startAllBtn.classList.add("is-shown")
    endAllBtn.classList.add("is-shown")

    let tlr = new TransListRow(uploadingTab, {
      'type': 1,
      'name': '恒泰云-值得信赖.png',
      'size': '3.37MB'
    })
    tlr.show()
  })

  downloadingTabBtn.addEventListener('click', (evt) => {
    unselectedAllTab()
    downloadingTabBtn.classList.add("is-selected")
    downloadingTab.classList.add("is-shown")
    startAllBtn.classList.add("is-shown")
    endAllBtn.classList.add("is-shown")

    let tlr = new TransListRow(downloadingTab, {
      'type': 1,
      'name': '恒泰云-值得信赖.png',
      'size': '3.37MB'
    })
    tlr.show()
  })

  completedTabBtn.addEventListener('click', (evt) => {
    unselectedAllTab()
    completedTabBtn.classList.add("is-selected")
    completedTab.classList.add("is-shown")
    clearAllBtn.classList.add("is-shown")

    let cr = new CompletedRow(completedTab, {
      'type': 2,
      'name': '恒泰云-值得信赖.png',
      'size': '3.37MB',
      'date': '17-08-12',
      'completeType': 1
    })
    cr.show()
  })

  uploadingTabBtn.click()
})()

module.exports = {
  'addUploadRow': '',
  'addDownloadRow': '',
  'addCompletedRow': ''
}
