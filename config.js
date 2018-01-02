const path = require('path')

module.exports = {
  api_host: "127.0.0.1",
  api_port: "32523",
  db_file_path: path.join(process.env.APPDATA, "AgentRabbit\\msgs.db"),
  offline_debug: false
}
