const Router = require("express").Router
const path = require("path")

function expressRouter(db){
    const router = Router(db)
    router.route('/')
        .get((req, res, next) => {
            res.sendFile(path.resolve(__dirname, "../../../public/notes.html"))
        })
        .post(async(req, res, next)=> {
            // if(db.inValid(req.body)) res.status(400).send(db.errMessage(req.body, true))
            if(!req.body.title || !req.body.text)return res.status(400).send("Improper request sent")
            console.log(req.body)
            try {
                const record = await db.create(req.body)
                res.send(record)
            } catch (err){
                res.send(err)
            }
        })
        .put(async(req, res, next) => {
            if(db.inValid(req.body)) res.status(400).send(db.errMessage(res.body))
            try{
                const record = await db.update(req.body)
                res.send(record)
            } catch (err) {
                res.send(err)
            }
        })
        .delete(async(req, res, next) => {
            try {
                const message = await db.destroy(req.body)
                res.send(message)
            } catch (err) {
                res.send(err)
            }
        })
    router.route("/:id").get(async (req, res) => {
        const record = await db.record(req.params)
        res.send(record)
    })
    return router
}
module.exports = expressRouter