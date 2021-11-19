const request = require("supertest")
const generateApp = require("./app")
const { v4: uuidv4 } = require('uuid');
// const jest = require("@jest.globals").jest 

const index = jest.fn()
const create = jest.fn()
const update = jest.fn()
const destroy = jest.fn()
const inValid = jest.fn()
const errMessage = "Error Message"

const app = generateApp({
    index, 
    create, 
    update,
    destroy,
    inValid,
    errMessage
})


const endPoint = (root, ...params) => {
    const obj =  {root: "/" + root}
    params.forEach(p => {
        p= p.toLowerCase()
        let key = p 
        if(p in obj){
            let count = 0
            key = key + "Copy"
            while(key in obj){
                key = key + count 
                count++
            }
        }
        obj[key] = [obj.root, ":"+p].join("/")
    })
    return obj
}

describe("API Requests", () => {
    const noteRoute = endPoint("api/notes")
    describe("GET " + noteRoute.root,()=>{
        test("it should return with a 200 status code", async()=>{
            const res = await request(app).get(noteRoute.root)
            expect(res.statusCode).toBe(200)
        })
        test("it should specify json in content type header", async()=>{
            const res = await request(app).get(noteRoute.root)
            expect(res.headers['content-type']).toEqual(expect.stringContaining("json"))
        })
        test("it should return an array of data", async()=>{
            const res = await request(app).get(noteRoute.root)
            expect(res.body).toBeDefined()
            expect(Array.isArray(res.body)).toBe(true)
        })
    })
    describe("POST " + noteRoute.root,()=>{
        beforeEach(()=> create.mockReset())
        describe("given a title and text",()=> {
            const bodyData = [
                {title: "Title1", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."},
                {title: "Title2", text: "Hello World"},
                {title: "Title3", text: "Foo Bar"}
            ]
            test("should send a status of 200", async ()=>{
                const res = await request(app).post(noteRoute.root).send(bodyData[0])
                expect(res.status).toBe(200)
            })
            test("should save title and text to the database", async () => {
                for(const req of bodyData){
                    create.mockReset()
                    const res = await request(app).post(noteRoute.root).send(req)
                    expect(create.mock.calls.length).toBe(1)
                    expect(create.mock.calls[0][0].title).toBe(req.title)
                    expect(create.mock.calls[0][0].text).toBe(req.text)
                }
            })
            test("should return a id, title and text", async ()=>{
                const output = { id: uuidv4(),...bodyData[0]}
                create.mockResolvedValue(output)
                const res = await request(app).post(noteRoute.root).send(bodyData[0])
                expect(res.body).toEqual(output)
                expect(res.body.id).toBe(output.id)
                expect(res.body.title).toBe(output.title)
                expect(res.body.text).toBe(output.text)
            })
        })
        describe("db should update correctly given actions", () => {
            
        })
        describe("when data is improperly given", ()=>{
            test("it should return status code of 400", async () => {
                const res = await request(app).post(noteRoute.root).send({title: "Failing"})
                expect(res.statusCode).toBe(400)
            })
        })
    })
})

