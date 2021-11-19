const express = require("express")
const apiRouter = require("./routers/api/router")
const viewRouter = require("./routers/notes/router")

const path = require("path")


function expressApp(db){
  const app = express()
  const index = path.resolve(__dirname, "../public/index.html")
  db = typeof db === "function" ?  db() : db
  app.use(express.json())
  app.use(express.urlencoded({extended: true}))
  app.use(express.static("public"));
  app.use("/api/notes", apiRouter(db))
  app.use("/notes", viewRouter(db))
  app.use("/", (req, res) => {
    res.sendFile(index)
  })
  return app
}


module.exports =  expressApp 


