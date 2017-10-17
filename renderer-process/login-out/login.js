const ipc = require('electron').ipcRenderer

const loginBtn = document.getElementById('login')
// const loginModal = document.getElementById('login-modal')
// const allFilesBtn = document.getElementById('button-all-files')

const usrInput = document.getElementById('username')
const pwdInput = document.getElementById('password')

loginBtn.addEventListener('click', function () {
  if (usrInput.value === '' || pwdInput.value === '') {
    alert("Username or Password is None!")
  } else {
    // send msg to main process for login
    ipc.send('login', usrInput.value + '#' + pwdInput.value)
  }
})

ipc.on('login-reply', function (event, arg) {
  if (arg != null) {
    alert("Username or Password is invalid!")
  } else {
    // TODO: Send event to close this window
    //       and create main window
    usrInput.value = ''
    pwdInput.value = ''

    // loginModal.classList.remove('is-shown')
    // showMainContent()
    // allFilesBtn.click()
  }
})

function showMainContent () {
  document.querySelector('.js-nav').classList.add('is-shown')
  document.querySelector('.js-content').classList.add('is-shown')
}

