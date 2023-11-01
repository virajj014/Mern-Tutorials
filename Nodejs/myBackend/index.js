const express = require('express')
const validator = require('validator')
const app = express()
const port = 8000

app.get('/', function (req, res) {
  let isEmail = validator.isEmail('virajj014gmail.com')
  res.send(`${isEmail}`)
})


app.listen(port, function () {
  console.log('Port '+port+' is running')
})