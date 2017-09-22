class FileTree {
  constructor(rootPath) {
    this.root = rootPath
    this.tree = []
  }

  update(fileList) {
    fileList.map((file) => {
      fPath = (__dirname+'\\\\'+file).split('\\')
      let level = 0
      let parent = this.root
      for(let e in fPath) {
        if(!this.findNode(e, level)) {
          this.addNode(e, level, parent)
        }
        level++
        parent = e
      }
    })
  }

  addNode(name, level, parent) {}

  delNode(name, level) {}

  findNode(name, level) {}

  toString() {}
}

exports.FileTree = FileTree
