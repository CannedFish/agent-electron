const config = require(__dirname + '/config.js')
if(!config.offline_debug) {
  const net = require('net')
  const sqlite3 = require('sqlite3').verbose()
}

function getTenantInfo(callback) {
  if(config.offline_debug) {
    setTimeout((cb) => {
      cb(null, 'http://127.0.0.1:5000/auth', 'dongdong')
    }, 3000, callback)
    return 
  }

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

  httpCall('POST', '/api/authenticate', (err, ret) => {
    if(err) {
      return callback(err)
    }
    info.token = ret.token
    info.usr = usr
    info.pwd = pwd
    info.auth_url = auth_url
    info.tenant_name = tenant_name
    return callback(null, ret.token)
  })
}
exports.authenticate = authenticate

function getContainers(callback) {
  if(config.offline_debug) {
    setTimeout((cb) => {
      cb(null, [
        {name: '文件夹1', type: 0},
        {name: '文档2', type: 1},
        {name: '文档3', type: 1}
      ])
    }, 3000, callback)
    return 
  }

  if(!info.token) {
    return callback('Please authenticate first')
  }
  httpCall('GET'
    , '/api/containers?preauthtoken={0}&preauthurl={1}&user={2}&tenant_name={3}'.format(info.token, info.auth_url, info.usr, info.tenant_name)
    , (err, ret) => {
      if(err) {
        if(ret.errcode == 1) {
          return callback(null, ret.results)
        } else {
          return callback(ret.msg)
        }
      }
  })
}
exports.getContainers = getContainers

function getObjects(containerName) {
  if(!info.token) {
    return callback('Please authenticate first')
  }
  httpCall('GET'
    , '/api/containers?user={0}&key={1}&tenant_name={2}&container_name={3}'.format(info.usr, info.pwd, info.tenant_name, containerName)
    , (err, ret) => {
      if(err) {
        return callback(err)
      }
  })
}

function uploadObjects() {
  if(!info.token) {
    return callback('Please authenticate first')
  }
}

function downloadObjects() {
  if(!info.token) {
    return callback('Please authenticate first')
  }
}

function httpCall(http_method, http_path, callback) {
  const req = net.request({
    method: http_method,
    protocol: 'http:',
    hostname: config.api_host,
    port: config.api_port,
    path: http_path
  })
  req.on('response', (resp) => {
    if(resp.statusCode != 200) {
      return callback('Authenticate failed: {0}'.format(resp.statusCode))
    }
    let data = ''
    resp.on('data', (chunk) => {
      data += chunk
    }).on('end', () => {
      return callback(null, JSON.parse(data))
    })
  })
  req.end()
}
