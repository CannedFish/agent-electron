const links = document.querySelectorAll('link[rel="import"]')

// Import and add each page to the DOM
Array.prototype.forEach.call(links, function (link) {
  let template = link.import.querySelector('.task-template')
  let clone = document.importNode(template.content, true)
  if (link.href.match('login-out')) {
    document.querySelector('body').appendChild(clone)
  } else if (link.href.match('nav')) {
    document.querySelector('.nav').appendChild(clone)
  } else if (link.href.match('file-icon') 
      || link.href.match('trans-list-row') 
      || link.href.match('completed-row')) {
    return
  } else {
    document.querySelector('.content').appendChild(clone)
  }
})
