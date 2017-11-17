const ipc = require('electron').ipcRenderer

const transListRowLink = document.getElementById('trans-list-row')
const transListRowTemplate = transListRowLink.import.querySelector('.task-template')

const iconString = [
  '<use xlink:href="#icon-wenjianjia"></use>',
  '<use xlink:href="#icon-wendang"></use>',
  '<use xlink:href="#icon-tupian"></use>',
  '<use xlink:href="#icon-shipin"></use>'
]

const KB = 1024
const MB = KB*1024
const GB = MB*1024

class TransListRow {

  constructor(parentNode, info) {
    this._obj = document.importNode(transListRowTemplate.content, true).firstElementChild
    this._parent = parentNode
    this._info = info
    this._progress = {
      'done': this._obj.querySelector('.done'),
      'speed': this._obj.querySelector('.speed'),
      'completed': 0
    }
    this._state = 0 // 0 => pause, 1 => working
  }

  show() {
    this._obj.querySelector('.file-icon2').innerHTML = iconString[this._info['type']]
    this._obj.querySelector('.file-name').innerHTML = this._info['name']
    this._obj.querySelector('.file-size').innerHTML = this._info['size']

    this._parent.appendChild(this._obj)
  }

  updateProgress(completedSize, interval) {
    this._progress['done'].style.width = '{0}%'.format(Math.round(completedSize/this._info['size']*100))

    let curSpeed = Math.round((completedSize - this._progress['completed']) / interval)
    let unit = 'B'
    if(curSpeed > GB) {
      curSpeed = Math.round(curSpeed/GB)
      unit = 'GB'
    } else if(curSpeed > MB) {
      curSpeed = Math.round(curSpeed/MB)
      unit = 'MB'
    } else if(curSpeed > KB) {
      curSpeed = Math.round(curSpeed/KB)
      unit = 'KB'
    }
    this._progress['speed'].innerHTML = '{0}{1}/s'.format(curSpeed, unit)

    this._progress['completed'] = completedSize
  }

  start() {
    // TODO: start progress
  }

  stop() {
    // TODO: stop progress
  }

  openDir() {
    // TODO: open local file directory
  }
}

exports.TransListRow = TransListRow
