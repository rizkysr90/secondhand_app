const app = require('../app')
const request = require('supertest')

let token = null;
// Login terlebih dahulu agar bisa mengakses Semua Users
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

describe('Endpoint User Get All', () => {
    test('Get user By All', async() => {
        const response = await request(app)
        .get(`${process.env.BASE_URL}/${process.env.URL_ROUTER_USER}?page=1`)
        .set('Authorization', 'Bearer ' + token)
        const {messege} = response.body
        expect(messege).toBe('Succcess')
    })
})