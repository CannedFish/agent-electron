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

  constructor(type, name, parentNode) {
    this._obj = document.importNode(fileIconTemplate.content, true)
    this._type = type // 0 => dir, 1 => doc, 2 => pic, 3 => video
    this._name = name
    this._parent = parentNode
  }

  show() {
    this._obj.querySelector('.icon-img').innerHTML = iconString[this._type]
    this._obj.querySelector('.icon-txt').innerHTML = this._name

    var self = this._obj.firstElementChild
    this._obj.firstElementChild.addEventListener('click', (evt) => {
      self.focus()
      console.log('clicked')
    })

    this._parent.appendChild(this._obj)
  }
}

module.exports = FileIcon

