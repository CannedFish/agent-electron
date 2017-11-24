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

let uploadList = {}
let downloadList = {}
let completeList = {}

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
  // TODO: initialize uploadlist, downloadlist and completelist from record

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

  ipc.on('uploading', (evt, filetype, filename, filesize) => {
    // add a row in upload tab
    addUploadRow(filetype, filename, filesize)
  }).on('downloading', (evt, filetype, filename, filesize) => {
    // add a row in download tab
    addDownloadRow(filetype, filename, filesize)
  }).on('upload-complete', (evt, filetype, filename, filesize, date) => {
    addCompletedRow(filetype, filename, filesize, date, 0)
  }).on('download-complete', (evt, filetype, filename, filesize, date) => {
    // add a row in completed tab
    addCompletedRow(filetype, filename, filesize, date, 1)
    // TODO: remove row from download tab
  })
})()

function addUploadRow(file_type, file_name, file_size) {
  let tlr = new TransListRow(uploadingTab, {
    'type': file_type,
    'name': file_name,
    'size': file_size
  })
  tlr.show()
}

function addDownloadRow(file_type, file_name, file_size) {
  let tlr = new TransListRow(downloadingTab, {
    'type': file_type,
    'name': file_name,
    'size': file_size
  })
  tlr.show()
}

function addCompletedRow(file_type, file_name, file_size, file_date, file_completeType) {
  let cr = new CompletedRow(completedTab, {
    'type': file_type,
    'name': file_name,
    'size': file_size,
    'date': file_date,
    'completeType': file_completeType
  })
  cr.show()
}

module.exports = {
  'addUploadRow': addUploadRow,
  'addDownloadRow': addDownloadRow,
  'addCompletedRow': addCompletedRow
}
