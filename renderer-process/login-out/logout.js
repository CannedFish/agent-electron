const ipc = require('electron').ipcRenderer

const logoutBtn = document.getElementById('logout')
const logoutModal = document.getElementById('logout-modal')

ipc.on('logout-reply', (evt, arg) => {
  if(arg != null) {
    logoutModal.classList.remove('is-shown')
    hideMainContent()
  }
})

logoutBtn.addEventListener('click', function () {
  ipc.send('logout')
})

function hideMainContent () {
  document.querySelector('.js-nav').classList.remove('is-shown')
  document.querySelector('.js-content').classList.remove('is-shown')
}

