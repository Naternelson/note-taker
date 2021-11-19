const fs = require("fs")
const promisify = require("promisify")
const {v4: uuid} = require("uuid")
const path = require("path")

const filepath = path.resolve(__dirname, "../db/db.json")

function model({dbType = "json", validation}){
    
    // ====================
    // Initialition 
    // ====================

    validation = typeof validation === "function" ? validation : (data) => data 
    const db = path.resolve(__dirname, `../db/${process.env.NODE_ENV}.${dbType}`)
    fs.access(path, fs.F_OK, (err) => {if (err) throw(err)})

    // ====================
    // Private Methods 
    // ====================

    const readDb = async () => {
        const data = await promisify(fs.readFile(db)) 
        return JSON.parse(data)
    }
    
    const write = async (newData) => {
        if (typeof validation === "function" && !validation(newData)) throw new Error("Data is invalid")
        await promisify(fs.writeFile(db, newData))
        return newData 
    }

    const findIndexById = async (id) => {
        const data = await readDb() 
        return data.findIndex(el => String(el.id) === String(id))
    }

    // ====================
    // Public Methods
    // ====================

    const public = {
        index: async () => {
            const data = await readDb()
            return data 
        },
        create: async (obj) => {
            if(obj.id) throw Error("Obj has existing ID. Consider changing to update instead of create")
            if(validation(obj)){
                const data = await readDb() 
                obj = {...obj, id: uuid()}
                data.push(obj)
                await write(data)
                return obj 
            } else throw new Error("Record is not valid")
        },
        update: async (obj) => {
            if(validation(obj) && obj.id){
                const data = await readDb() 
                const index = findIndexById(obj.id)
                if(index === -1) throw new Error("Record with an id of " + obj.id + " not found")
                data[index] = obj
                await write(data)
                return obj 
            } else throw new Error("Record is not valid")
        },
        destroy: async (obj) => {
            const data = await readDb() 
            const index = findIndexById(obj.id)
            if(index === -1) throw new Error("Record with an id of " + obj.id + " not found")
        }
    }
    return public 

   
}



// function database(){
//     const findById = (data, id) => {
//         const index = data.findIndex(record => record.id === id)
//         return index
//     }
//     const isValid = (obj, ignoreId = false) => {
//         return !!errMessage(obj, ignoreId)
//     }
//     const isInvalid = (obj, ignoreId = false) => {
//         return !errMessage(obj, ignoreId)
//     }
//     const errMessage = (obj, ignoreId = false) => {
//         const {id, title, text} = obj
//         let key
//         if (!ignoreId) key = !id ? "id" : !title ? "title" : "text"
//         if(ignoreId) key = !title ? "title" : "text"
//         return  key ? `${key} is missing. Record is invalid` : null 
//     }
//     const read = () => new Promise((res, rej) => {
//         fs.readFile(filepath, (err, data) => {
//             if(err) rej(err)
//             res(JSON.parse(data))
//     })})
//     const write = () => new Promise((res, rej) => {
//             (newData) => fs.writeFile(filepath, newData, err => {
//                 if(err) rej(err)
//                 res()
//         })
//     })
//     const index = async () => {
//         const data = await read()
//         return data
//     }
//     const record = async (obj) => {
//         const data = await read() 
//         return data[findById(obj.id)]
//     }
//     const create = async (obj) => {
//         if(isInvalid(obj, true)) throw Error(errMessage(obj, true))
//         const data = await read()
//         data.push({id: uuid(), ...obj})
//         const record = write(data)
//         return record 
//     }
//     const update = async (obj) => {
//         const data = await read()
//         const {id} = obj

//         if(isInvalid(obj)) throw new Error(errMessage(obj))

//         const index = findById(data, id)
//         if(index === -1) throw new Error("Record with an id of (" + id + ") not found.")
//         data[index] = obj 
//         await write(data)
//         return data[index]
//     }
//     const destroy = async(obj)=>{
//         const data = read()
//         const index = findById(data, obj.id)
//         data.splice(index, 1)
//         await write(data)
//         return "Record with id of " + obj.id + " has been deleted from the db"
//     }

//     return {index, create, update, destroy, isValid, isInvalid, findById, record}
// }
// module.exports = database()


