const path = require('path')

module.exports = {
  api_host: "192.168.1.48",
  api_port: "32523",
  db_file_path: path.join(process.env.APPDATA, 'AgentRabbit/msgs.db'),
  offline_debug: false
}
