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


describe('Endpoint Get All Cities', () => {
    // Positif test
    test('Get All Cities success', async() => {
        const response = await request(app)
        .get(`${process.env.BASE_URL}${process.env.URL_ROUTER_CITY}?page=1&row=10&name=bekasi`)
        .set('Authorization', 'Bearer ' + token)
        const {code, data} = response.body
        expect(code).toBe(200);
    })

    // Negatif Test
    test('Get All Cities Internal Server', async() => {
        const response = await request(app)
        .get(`${process.env.BASE_URL}${process.env.URL_ROUTER_CITY}?page=&row=10&name=bekasi`)
        .set('Authorization', 'Bearer ' + token)
        const {code, message} = response.body
        expect(code).toBe(500);
        expect(message).toBe('Internal Server Error')
    })
})