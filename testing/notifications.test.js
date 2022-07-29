const app = require('../app')
const request = require('supertest')

let token = null;
let id = 1;
// Login terlebih dahulu agar bisa mengakses product buyer
beforeAll(function(done) {
    request(app)
        .post(`${process.env.BASE_URL}/${process.env.URL_ROUTER_LOGIN}`)
        .send({
                email : "user1@gmail.com",
                password : "123456789"
            })
        .set('Accept', 'application/json')
        .end(function(err, res) {
            token = res.body.data.token; // Or something
            done();
        });
  });

describe('Endpoint Get All Notifications', () => {
    // Positif test
    test('Get All Notifications success', async() => {
        const response = await request(app)
        .get(`${process.env.BASE_URL}${process.env.URL_ROUTER_NOTIFICATION}`)
        .set('Authorization', 'Bearer ' + token)

        const {code, data} = response.body
        expect(code).toBe(200)
    })
})

describe('Endpoint Get id Notifications', () => {
    const id = 1;
    // Positif test
    test('Get id Notifications success', async() => {
        const response = await request(app)
        .patch(`${process.env.BASE_URL}${process.env.URL_ROUTER_NOTIFICATION}/${id}`)
        .set('Authorization', 'Bearer ' + token)
        .send({
            status : 1
        })
        .set('Accept', 'application/json')

        const {code, data} = response.body
        expect(code).toBe(200)
        expect(data).toBe('Status Notifikasi Berhasil')
    })
    // Negatif Test
    test('Get id Notifications Not Found', async() => {
        const response = await request(app)
        .patch(`${process.env.BASE_URL}${process.env.URL_ROUTER_NOTIFICATION}/${1000}`)
        .set('Authorization', 'Bearer ' + token)
        .send({
            status : 1
        })
        .set('Accept', 'application/json')

        const {code, message} = response.body
        expect(code).toBe(404)
        expect(message).toBe('Notification Not Found')
    })

    test('Get id Notifications Internal Server', async() => {
        const response = await request(app)
        .patch(`${process.env.BASE_URL}${process.env.URL_ROUTER_NOTIFICATION}/${null}`)
        .set('Authorization', 'Bearer ' + token)
        .send({
            status : 1
        })
        .set('Accept', 'application/json')

        const {code, message} = response.body
        expect(code).toBe(500)
        expect(message).toBe('Internal Server Error')
    })
})