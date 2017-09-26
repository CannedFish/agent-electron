const FileNode = require('./main-process/files/file-tree').FileNode

exports.getFileList = function(cur, callback) {
  // callback: (err, files)
  // return a list of file object via the callback function
  // NOTE: Just for testing
  files = [
    new FileNode(cur, 'a', 'd'),
    new FileNode(cur, 'b', 'f'),
    new FileNode(cur, 'c', 'f')
  ]
  callback(null, files)
}

