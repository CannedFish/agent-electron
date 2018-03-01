const path = require('path')
const fs = require('fs')
const uuidv1 = require('uuid/v1')

const config = require(__dirname + '/config.js')

const net = require('http')
// const net = require('electron').net
let sqlite3 = null
if(!config.offline_debug) {
  sqlite3 = require('sqlite3').verbose()
}

function getTenantInfo(callback) {
  if(config.offline_debug) {
    setTimeout((cb) => {
      cb(null, 'http://127.0.0.1:5000/auth', 'dongdong')
    }, 3000, callback)
    return 
  }

  console.log(config.db_file_path)
  let db = new sqlite3.Database(config.db_file_path)

  db.get('select auth_url, tenant_name from info', (err, row) => {
    if(err != null) {
      console.log(err)
      return callback(err)
    }
    return callback(err, row.auth_url, row.tenant_name)
  })

  db.close()
}
exports.getTenantInfo = getTenantInfo

var info = {
  token: null,
  usr: null,
  pwd: null,
  auth_url: null,
  tenant_name: null
}
// REST APIs
function authenticate(usr, pwd, auth_url, tenant_name, callback) {
  if(config.offline_debug) {
    info.token = 'abcd-efgh-ijkl-mnop'
    info.usr = usr
    info.pwd = pwd
    info.auth_url = auth_url
    info.tenant_name = tenant_name
    setTimeout((cb) => {
      cb(null, info.token)
    }, 3000, callback)
    return 
  }

  doPost('/api/authenticate', {
	  user: usr,
	  key: pwd,
	  auth_url: auth_url,
	  tenant_name: tenant_name
  }, (err, ret) => {
    if(err) {
      return callback(err)
    }
    info.token = ret.results[0].token
    info.usr = usr
    info.pwd = pwd
    info.auth_url = auth_url
    info.tenant_name = tenant_name
    return callback(null, ret)
  })
}
exports.authenticate = authenticate

function getContainers(callback) {
  if(config.offline_debug) {
    setTimeout((cb) => {
      cb(null, [
        {name: '文件夹1', type: 0, size: '34MB'},
        {name: '文件夹2', type: 0, size: '432MB'},
        {name: '文件夹3', type: 0, size: '98MB'}
      ])
    }, 3000, callback)
    return 
  }

  if(!info.token) {
    return callback('Please authenticate first')
  }
  doGet(`/api/containers?user=${info.usr}&key=${info.pwd}&tenant_name=${info.tenant_name}&auth_url=${info.auth_url}`
    , (err, ret) => {
      if(err) {
        return callback(err)
      }
      if(ret.errcode == 1) {
        return callback(null, ret.results.map((f) => {
          return {name: f.name, type: 0, count: f.count, size: f.bytes};
        }))
      } else {
        return callback(ret.msg)
      }
  })
}
exports.getContainers = getContainers

function getObjects(containerName, callback) {
  if(config.offline_debug) {
    setTimeout((cb) => {
      cb(null, [...Array(100).keys()].map((i) => {
        return {
          name: `文档${i}-234234-235234-123-32423-5345234232-1234123412432-234`,
          type: 1,
          size: '98MB',
          container: 'container'
        }
      }))
    }, 3000, callback)
    return 
  }

  if(!info.token) {
    return callback('Please authenticate first')
  }
  // doGet(`/api/get_container?user=${info.usr}&key=${info.pwd}&tenant_name=${info.tenant_name}&container_name=${containerName}&auth_url=${info.auth_url}&with_data=1`
  //   , (err, ret) => {
  //     if(err) {
  //       return callback(err)
  //     }
  //     if(ret.errcode == 1) {
  //       let info = ret.results[0]
  //       return callback(null,
  //         Array.prototype.map.call(info.data.split('\n'), (filename) => {
  //           let filetype = null
  //           if(filename.endsWith('/')) {
  //             filetype = 0
  //           } else {
  //             filetype = 1
  //           }
  //           return {
  //             name: filename,
  //             type: filetype,
  //             container: containerName,
  //             size: 0
  //           }
  //       }))
  //     } else {
  //       return callback(ret.msg)
  //     }
  // })
  let b64ConName = new Buffer(containerName).toString('base64')
  doGet(`/api/objects?user=${info.usr}&key=${info.pwd}&tenant_name=${info.tenant_name}&container_name=${b64ConName}&auth_url=${info.auth_url}`
    , (err, ret) => {
      if(err) {
        return callback(err)
      }
      if(ret.errcode == 1) {
        return callback(null, ret.results.map((obj) => {
          if(obj.hasOwnProperty('subdir')) {
            return {
              name: obj.subdir,
              type: 0,
              size: 0,
              container: containerName,
              last_modified: null
            }
          } else {
            return {
              name: obj.name,
              type: 1,
              size: obj.bytes,
              container: containerName,
              last_modified: obj.last_modified
            }
          }
        }))
      } else {
        return callback(ret.msg)
      }
  })

}
exports.getObjects = getObjects

function uploadObject(uploadFilePath, fileSize, container, callback) {
  // console.log(`POST http://${config.api_host}:${config.api_port}/api/upload_object`)

  if(config.offline_debug) {
    setTimeout((cb) => {
      // cb(null, {
        // name: uploadFilePath
      // })
      cb({err: "failed"})
    }, 10000, callback)
    return 
  }

  if(!info.token) {
    return callback('Please authenticate first')
  }

  const fileName = path.basename(uploadFilePath)
  let now = (new Date()).toISOString().split('.')[0].replace(/[-:T]/g, '')
  let ext = path.extname(fileName)
  let fmtFileName = `${fileName.substr(0, fileName.indexOf(ext))}-${now}${ext}`
  doPost('/api/upload_object', {
    user: info.usr,
    key: info.pwd,
    auth_url: info.auth_url,
    tenant_name: info.tenant_name,
    container_name: container,
    object_name: fmtFileName,
    orig_file_name: fileName,
    upload_file: uploadFilePath
  }, (err, ret) => {
    if(err) {
      return callback(err)
    }
    console.log(ret)
    if(ret.errcode == 0) {
      return callback(ret)
    } else {
      return callback(null, ret)
    }
  })
  /* const boundaryKey = Math.random().toString(16) */
  // const fileName = path.basename(uploadFilePath)

  // const req = net.request({
    // method: 'POST',
    // protocol: 'http:',
    // hostname: config.api_host,
    // port: config.api_port,
    // path: '/api/upload_object'
  // })

  // req.on('response', (resp) => {
    // if(resp.statusCode != 200) {
      // return callback(`Authenticate failed: ${resp.statusCode}`)
    // }
    // let data = ''
    // resp.on('data', (chunk) => {
      // data += chunk
    // }).on('end', () => {
      // return callback(null, JSON.parse(data))
    // })
  // })

  // let now = (new Date()).toISOString().split('.')[0].replace(/[-:T]/g, '')
  // let ext = path.extname(fileName)
  // let fmtFileName = `${fileName.substr(0, fileName.indexOf(ext))}-${now}${ext}`
  // let payload = `--${boundaryKey}\r\nContent-Disposition: form-data; name="user"\r\n\r\n${info.usr}\r\n`
        // + `--${boundaryKey}\r\nContent-Disposition: form-data; name="key"\r\n\r\n${info.pwd}\r\n`
        // + `--${boundaryKey}\r\nContent-Disposition: form-data; name="auth_url"\r\n\r\n${info.auth_url}\r\n`
        // + `--${boundaryKey}\r\nContent-Disposition: form-data; name="tenant_name"\r\n\r\n${info.tenant_name}\r\n`
        // + `--${boundaryKey}\r\nContent-Disposition: form-data; name="container_name"\r\n\r\n${container}\r\n`
        // + `--${boundaryKey}\r\nContent-Disposition: form-data; name="object_name"\r\n\r\n${fmtFileName}\r\n`
        // + `--${boundaryKey}\r\nContent-Disposition: form-data; name="orig_file_name"\r\n\r\n${fileName}\r\n`
        // + `--${boundaryKey}\r\nContent-Disposition: form-data; name="upload_file"; filename="${fileName}"\r\n\r\n`
  // let endStr = `\r\n--${boundaryKey}--\r\n`


  // req.setHeader('Content-Type', `multipart/form-data; boundary=${boundaryKey}`)
  // req.setHeader('Content-Length', Buffer.byteLength(payload)+fileSize+Buffer.byteLength(endStr))

  // console.log('payload', payload)
  // req.write(payload)
  
  // let rs = fs.createReadStream(uploadFilePath)
  // rs.on('data', (chunk) => {
    // console.log('file chunk', chunk)
    // req.write(chunk)
  // }).on('end', () => {
    // console.log('end string', endStr)
    // req.end(endStr)
  /* }) */
}
exports.uploadObject = uploadObject

function downloadObject(containerName, objectName, download_to, callback) {
  if(config.offline_debug) {
    setTimeout((cb) => {
      cb(null)
    }, 30000, callback)
    return 
  }

  if(!info.token) {
    return callback('Please authenticate first')
  }
  let b64ConName = new Buffer(containerName).toString('base64')
  let b64ObjName = new Buffer(objectName).toString('base64')
  let b64DownloadTo = new Buffer(download_to).toString('base64')
  doGet(`/api/get_object?user=${info.usr}&key=${info.pwd}&tenant_name=${info.tenant_name}&container_name=${b64ConName}&auth_url=${info.auth_url}&object_name=${b64ObjName}&with_data=1&download_to=${b64DownloadTo}`
    , (err, ret) => {
      if(err) {
        return callback(err)
      }
      if(ret.errcode == 1) {
        return callback(null)
      } else {
        return callback(ret.msg)
      }
  })
}
exports.downloadObject = downloadObject

function doGet(http_path, callback) {
  console.log(`GET http://${config.api_host}:${config.api_port}/${http_path}`)
  const req = net.request({
    method: 'GET',
    protocol: 'http:',
    hostname: config.api_host,
    port: config.api_port,
    path: http_path
  })
  // console.log(req)
  req.on('response', (resp) => {
    if(resp.statusCode != 200) {
      return callback(`Authenticate failed: ${resp.statusCode}`)
    }
    let data = ''
    resp.on('data', (chunk) => {
      data += chunk
    }).on('end', () => {
      return callback(null, JSON.parse(data))
    })
  }).on('error', (err) => {
    console.error('Get error occured:', err)
    return callback(err)
  })
  req.end()
}

function doPost(http_path, post_data, callback) {
  console.log(`POST http://${config.api_host}:${config.api_port}/${http_path}`)
  const postData = 'data='+JSON.stringify(post_data)
  const req = net.request({
    method: 'POST',
    protocol: 'http:',
    hostname: config.api_host,
    port: config.api_port,
    path: http_path,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(postData)
    }
  })
  // console.log(req)
  req.on('response', (resp) => {
    if(resp.statusCode != 200) {
      return callback(`Authenticate failed: ${resp.statusCode}`)
    }
    let data = ''
    resp.on('data', (chunk) => {
      data += chunk
    }).on('end', (chunk) => {
      return callback(null, JSON.parse(data))
    })
  }).on('error', (err) => {
    console.error('Post error occured:', err)
    return callback(err)
  })

  req.write(postData)
  req.end()
}
