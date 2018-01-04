const ipc = require('electron').ipcRenderer

const fileIconLink = document.getElementById('file-icon-template')
const fileIconTemplate = fileIconLink.import.querySelector('.task-template')

const iconString = [
  '<use xlink:href="#icon-wenjianjia"></use>',
  '<use xlink:href="#icon-wendang"></use>',
  '<use xlink:href="#icon-tupian"></use>',
  '<use xlink:href="#icon-shipin"></use>'
]

class FileIcon {

  constructor(type, name, parentNode, info) {
    this._obj = document.importNode(fileIconTemplate.content, true).firstElementChild
    this._type = type // 0 => dir, 1 => doc, 2 => pic, 3 => video
    this._name = name
    this._parent = parentNode
    this._info = info // name, type, size
  }

  show() {
    this._obj.querySelector('.icon-img').innerHTML = iconString[this._type]
    this._obj.querySelector('.icon-txt').innerHTML = this._name

    var self = this
    this._obj.addEventListener('click', (evt) => {
      evt.stopPropagation()
      self.select()
      console.log('clicked')
    })
    if(this._type == 0) {
      this._obj.addEventListener('dblclick', (evt) => {
        evt.stopPropagation()
        console.log('dbclicked')
        ipc.send('get-files', this._name, false)
      })
    }

    this._parent.appendChild(this._obj)
  }

  hide() {
    let icons = this._parent.querySelectorAll('.file-icon')
    Array.prototype.map.call(icons, (icon) => {
      icon.classList.remove('is-selected')
    })
    this._obj.classList.add('is-hidden')
  }

  showFromHidden() {
    let icons = this._parent.querySelectorAll('.file-icon')
    Array.prototype.map.call(icons, (icon) => {
      icon.classList.remove('is-selected')
    })
    this._obj.classList.remove('is-hidden')
  }

  select() {
    let icons = this._parent.querySelectorAll('.file-icon')
    Array.prototype.map.call(icons, (icon) => {
      icon.classList.remove('is-selected')
    })
    this._obj.classList.add("is-selected")
  }

  fileInfo() {
    return this._info
  }

  destroy() {
    this._parent.removeChild(this._obj)
  }
}

module.exports = FileIcon

