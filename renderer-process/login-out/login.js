const ipc = require('electron').ipcRenderer

const loginBtn = document.getElementById('login')
// const loginModal = document.getElementById('login-modal')
// const allFilesBtn = document.getElementById('button-all-files')

const usrInput = document.getElementById('username')
const pwdInput = document.getElementById('password')

const repwdCheckbox = document.querySelector('.repwd')
const autologinCheckbox = document.querySelector('.autologin')

const Checkbox = [
  '<svg class="icon" aria-hidden="true"><use xlink:href="#icon-duoxuan"></svg>',
  '<svg class="icon" aria-hidden="true"><use xlink:href="#icon-xuankuang"></svg>'
]

let repwd = false
let autologin = false

ipc.send('checkbox-state')

function login() {
  if (usrInput.value === '' || pwdInput.value === '') {
    alert("Username or Password is None!")
  } else {
    // send msg to main process for login
    ipc.send('login', usrInput.value + '#' + pwdInput.value)
  }
}

loginBtn.addEventListener('click', function () {
  login()
})

document.addEventListener('keypress', (evt) => {
  if(evt.key == "Enter") {
    login()
  }
})

ipc.on('login-reply', (event, arg) => {
  if (arg != null) {
    alert("Username or Password is invalid!")
  } else {
    // TODO: Send event to close this window
    //       and create main window
    usrInput.value = ''
    pwdInput.value = ''
  }
}).on('checkbox-state-reply', (evt, repwd_, autologin_) => {
  repwd = !repwd_
  repwdCheckbox.click()

  autologin = !autologin_
  autologinCheckbox.click()
})

repwdCheckbox.addEventListener('click', (evt) => {
  if(repwd) {
    repwdCheckbox.innerHTML = Checkbox[1]
    repwd = false
    if(autologin) {
      autologinCheckbox.click()
    }
  } else {
    repwdCheckbox.innerHTML = Checkbox[0]
    repwd = true
  }
  ipc.send('re-usr', repwd)
})

autologinCheckbox.addEventListener('click', (evt) => {
  if(autologin) {
    autologinCheckbox.innerHTML = Checkbox[1]
    autologin = false
  } else {
    autologinCheckbox.innerHTML = Checkbox[0]
    autologin = true
    if(!repwd) {
      repwdCheckbox.click()
    }
  }
  ipc.send('auto-login', autologin)
})

function showMainContent () {
  document.querySelector('.js-nav').classList.add('is-shown')
  document.querySelector('.js-content').classList.add('is-shown')
}

