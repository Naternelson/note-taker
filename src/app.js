const express = require("express")
const startCase = require("lodash").startCase
const { v4: uuidv4 } = require('uuid');


const missingKeys = (obj, seperator) => {
  const arr = []
  for(let key in obj){
    if(!obj[key]) arr.push(startCase(key))
  }
  if(seperator) return arr.join(seperator) 
  let arrLast = arr.slice(-2)
  let arrFirst = arr.slice(0, arr.length - arrLast.length - 1)
  return [arrFirst.join(", "), arrLast.join(" and ")].filter(el => el !== "").join(", ")
}

function app(db){
  const app = express()
  app.use(express.json())
  
  app.get('/api/notes', (req, res)=> {
    res.send([{id: 1, name: "hello"}])
  })
  app.post('/api/notes', async (req, res)=> {
    const {title, text} = req.body 
    if(title && text) {
      // const record = {id: uuidv4(), title, text}
      const record = await db.create({title, text})  
      return res.send(record)
    }
    const err = {error: {message: `Request is missing ${missingKeys({title,text})}`}}
    res.status(400).send(err)
  })
  return app
}


module.exports =  app 


