const ipc = require('electron').ipcRenderer

const logoutBtn = document.getElementById('logout')
const logoutModal = document.getElementById('logout-modal')
const loginModal = document.getElementById('login-modal')

logoutBtn.addEventListener('click', function () {
  logoutModal.classList.remove('is-shown')
  hideMainContent()
  loginModal.classList.add('is-shown')
})

function hideMainContent () {
  document.querySelector('.js-nav').classList.remove('is-shown')
  document.querySelector('.js-content').classList.remove('is-shown')
}

