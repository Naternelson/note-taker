const request = require("supertest")
const app = require("./app")

const endPoint = (root, params) => {
    const obj =  {root, ...params}
    for(let key in obj) obj[key] = obj[key][0] === "/" ? obj[key] : "/" + root
    return obj
}

describe("API Requests", () => {
    const noteRoute = endPoint("notes")
    describe("GET " + noteRoute.root,()=>{
        test("it should return with a 200 status code", async()=>{
            const res = await request(app).get(noteRoute.root)
            expect(res.statusCode).toBe(200)
        })
        test("it should specify json in conent type header", async()=>{
            const res = await request(app).get(noteRoute.root)
            expect(res.headers['content-type']).toEqual(expect.stringContaining("json"))
        })
        test("it should return an array of data", async()=>{
            const res = await request(app).get(noteRoute.root)
            console.log(res.body)
            expect(res.body).toBeDefined()
            expect(Array.isArray(res.body)).toBe(true)
        })
    })
})

