const db = require("./database")

const expressApp = require("./app") 
const app = expressApp(db)
const port = process.env.PORT || 8080
app.listen(port, ()=> {
    console.log(`Listening on port ${port}`)
  })
