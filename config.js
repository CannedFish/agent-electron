const path = require('path')
const os = require('os')

const SYSTEM = os.platform()

let __db_file_path = null
if(SYSTEM == 'win32') {
  __db_file_path = path.join(process.env.APPDATA, "AgentRabbit\\msgs.db")
} else if(SYSTEM == 'linux') {
  __db_file_path = '/var/AgentRabbit/msgs.db'
} else {
  throw new Error(`${SYSTEM} is not support!`)
}

module.exports = {
  api_host: "127.0.0.1",
  api_port: "32523",
  db_file_path: __db_file_path,
  offline_debug: false
}
