const ipc = require('electron').ipcRenderer

// nav buttons
const selfSection = document.getElementById('nav-section')
const navAllFilesBtn = document.getElementById('nav-all')
const navPicBtn = document.getElementById('nav-pic')
const navDocBtn = document.getElementById('nav-doc')
const navVideoBtn = document.getElementById('nav-video')
const navOtherBtn = document.getElementById('nav-other')
const btnList = [navAllFilesBtn, navPicBtn, navDocBtn
  , navVideoBtn, navOtherBtn]

function unselectedAllBtn() {
  btnList.map((btn) => {
    btn.classList.remove('is-selected')
  })
}

navAllFilesBtn.addEventListener('click', (evt) => {
  unselectedAllBtn()
  navAllFilesBtn.classList.add('is-selected')
})
navPicBtn.addEventListener('click', (evt) => {
  unselectedAllBtn()
  navPicBtn.classList.add('is-selected')
})
navDocBtn.addEventListener('click', (evt) => {
  unselectedAllBtn()
  navDocBtn.classList.add('is-selected')
})
navVideoBtn.addEventListener('click', (evt) => {
  unselectedAllBtn()
  navVideoBtn.classList.add('is-selected')
})
navOtherBtn.addEventListener('click', (evt) => {
  unselectedAllBtn()
  navOtherBtn.classList.add('is-selected')
})

selfSection.classList.add('is-shown')
navAllFilesBtn.click()

// space info
const spaceUsed = selfSection.querySelector('.space-used')
const spaceInfo = selfSection.querySelector('.space-info')

function updateSpaceInfo() {
  // TODO: call api to get info include (total, used)
  // spaceUsed.style.width = Math.round(used/total*100)
  // spaceInfo.innerHTML = "{0}GB/{1}GB".format(used, total)
}

