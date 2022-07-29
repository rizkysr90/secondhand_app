const app = require('../app')
const request = require('supertest')

describe('Endpoint register user ', () => {
    // Positif Test
    test('create data users success new User', async() => {
        const response = await request(app)
        .post(`${process.env.BASE_URL}/${process.env.URL_ROUTER_REGISTER}`)
        .send({
                email : "test@gmail.com",
                password : "test123456",
                name : "test"
            })
        .set('Accept', 'application/json')
        
        const {code, data} = response.body
        expect(code).toBe(201)
    })

    // negatif test
    test('create data users Error Data Sudah Digunakan', async() => {
        const response = await request(app)
        .post(`${process.env.BASE_URL}/${process.env.URL_ROUTER_REGISTER}`)
        .send({
                email : "user1@gmail.com",
                password : "123456789",
                name : "Uchiha Itachi"
            })
        .set('Accept', 'application/json')
        
        const {code, message} = response.body
        expect(code).toBe(400);
        expect(message).toBe(`Email sudah digunakan`)
    })
})