const ipc = require('electron').ipcRenderer

const selfSection = document.getElementById('all-files-section')

selfSection.addEventListener('section-show', function () {
  console.log('All files show')
})

selfSection.addEventListener('section-hide', function () {
  console.log('All files hide')
})
  
selfSection.addEventListener('click', function () {
  console.log('section clicked')
})

