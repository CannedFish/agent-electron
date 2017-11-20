const config = require(__dirname + '/config.js')
const sqlite3 = require('sqlite3').verbose()

let db = new sqlite3.Database(config.db_file_path)
