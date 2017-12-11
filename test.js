const path = require('path')

const common = require(path.join(__dirname, 'common.js'))

if(process.argv.length != 5) {
  console.log("Usage: node test.js $username $password $local_file_path")
  process.exit(1)
}

let usr = process.argv[2]
let pwd = process.argv[3]
let local_file_path = process.argv[4]

console.log('Arguments:', usr, pwd, local_file_path)

common.getTenantInfo((err, auth_url, tenant_name) => {
  if(err) {
    return console.log(err)
  }
  console.log('\n#0 getTenantInfo')
  console.log('result:', auth_url, tenant_name)

  common.authenticate(usr, pwd, auth_url, tenant_name, (err, token) => {
    if(err) {
      return console.log(err)
    }
    console.log('\n#1 authenticate')
    console.log('result:', token)

    common.getContainers((err, containers) => {
      if(err) {
        return console.log(err)
      }
      console.log('\n#2 getContainers')
      console.log('result:', containers)

      let target_container = containers[0].name
      common.getObjects(target_container, (err, objects) => {
        if(err) {
          return console.log(err)
        }
        console.log('\n#3 getObjects')
        console.log('result:', objects)
      })

      common.uploadObject(local_file_path, '123', target_container, (err, object) => {
        if(err) {
          return console.log(err)
        }
        console.log('\n#4 uploadObject')
        console.log('result:', object)
      })

      common.downloadObject(target_container, 'bbb', (err) => {
        if(err) {
          return console.log(err)
        }
        console.log('\n#5 downloadObject')
        console.log('result:', 'successfully')
      })

    })
  })
})


