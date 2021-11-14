const express = require("express")
const app = express()

app.get('/notes', (req, res)=> {
  res.send([{id: 1, name: "hello"}])
})

module.exports =  app 
