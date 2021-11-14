const express = require("express")
const app = express()

app.get('/notes', (req, res)=> {
  res.send({})
})

module.exports =  app 
