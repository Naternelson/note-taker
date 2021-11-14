const fs = require("fs")
const {v4: uuid} = require("uuid")

module.exports = function(){
    const findById = (data, id) => {
        const index = data.findIndex(record => record.id === id)
        return index
    }
    const isValid = (obj, ignoreId = false) => {
        return !!errMessage(obj, ignoreId)
    }
    const isInvalid = (obj, ignoreId = false) => {
        return !errMessage(obj, ignoreId)
    }
    const errMessage = (obj, ignoreId = false) => {
        const {id, title, text} = obj
        let key
        if (!ignoreId) key = !id ? "id" : !title ? "title" : "text"
        if(ignoreId) key = !title ? "title" : "text"
        return  key ? `${key} is missing. Record is invalid` : null 
    }
    const read = () => new Promise((res, rej) => {
        fs.readFile("../Develop/db/db.json", (err, data) => {
            if(err) rej(err)
            res(data)
    })})
    const write = () => new Promise((res, rej) => {
            (newData) => fs.writeFile("../Develop/db/db.json", newData, err => {
                if(err) rej(err)
                res()
        })
    })
    const index = async () => {
        const data = await read()
        return data
    }
    const create = async (obj) => {
        if(isInvalid(obj, true)) throw Error(errMessage(obj, true))
        const data = await read()
        data.push({id: uuid(), ...obj})
        const record = write(data)
        return record 
    }
    const update = async (obj) => {
        const data = await read()
        const {id} = obj

        if(isInvalid(obj)) throw new Error(errMessage(obj))

        const index = findById(data, id)
        if(index === -1) throw new Error("Record with an id of (" + id + ") not found.")
        data[index] = obj 
        await write(data)
        return data[index]
    }
    const destroy = async(obj)=>{
        const data = read()
        const index = findById(data, obj.id)
        data.splice(index, 1)
        await write(data)
        return "Record with id of " + obj.id + " has been deleted from the db"
    }
    return {index, create, update, destroy, isValid, isInvalid, findById}
}