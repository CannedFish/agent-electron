const ipc = require('electron').ipcRenderer

const selfSection = document.getElementById('all-files-section')

selfSection.addEventListener('section-show', function () {
  console.log('All files show')
  ipc.send('get-files', '.')
})

selfSection.addEventListener('section-hide', function () {
  console.log('All files hide')
})
  
ipc.on('get-files-reply', function (evt, arg) {
  console.log(arg)
})

