const app = require('../app')
const request = require('supertest');

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

describe('GET endpoint : /sales',() => {
    test('it should be success to get all sales because user was login',async () => {
        const response = await request(app)
        .get(`${process.env.BASE_URL}/${process.env.URL_ROUTER_ORDER_SELLER}`)
        .set('Authorization', 'Bearer ' + token)
        const {code, data} = response.body
        expect(code).toBe(200);
    })
    test('it should be success to get all sales with query param, status = 1',async () => {
        const response = await request(app)
        .get(`${process.env.BASE_URL}/${process.env.URL_ROUTER_ORDER_SELLER}?status=1`)
        .set('Authorization', 'Bearer ' + token)
        const {code, data} = response.body
        expect(code).toBe(200);
    })
    test('it should be success to get all sales with query param,done = 1',async () => {
        const response = await request(app)
        .get(`${process.env.BASE_URL}/${process.env.URL_ROUTER_ORDER_SELLER}?done=1`)
        .set('Authorization', 'Bearer ' + token)
        const {code, data} = response.body
        expect(code).toBe(200);
    })
    
})

describe('GET endpoint /sales/orders/:order_id',() => {
    // order_id 3 adalah milik seller_id 1,lihat di master data seeder
    test('it should be success to get order by id',async () => {
        const response = await request(app)
        .get(`${process.env.BASE_URL}/${process.env.URL_ROUTER_ORDER_SELLER}/orders/3`)
        .set('Authorization', 'Bearer ' + token)
        const {code, data} = response.body
    })
    test('it should be failed because order_id not integer',async () => {
        const response = await request(app)
        .get(`${process.env.BASE_URL}/${process.env.URL_ROUTER_ORDER_SELLER}/orders/notinteger`)
        .set('Authorization', 'Bearer ' + token)
        const {code, data} = response.body
        expect(code).toBe(400);
    })
    test('it should be failed because order_id 1 is not owned by user login which is user_id 1',async () => {
        const response = await request(app)
        .get(`${process.env.BASE_URL}/${process.env.URL_ROUTER_ORDER_SELLER}/orders/1`)
        .set('Authorization', 'Bearer ' + token)
        const {code, data} = response.body
        expect(code).toBe(401);
    })
    test('it should be failed because order_id 100 is not  found',async () => {
        const response = await request(app)
        .get(`${process.env.BASE_URL}/${process.env.URL_ROUTER_ORDER_SELLER}/orders/100`)
        .set('Authorization', 'Bearer ' + token)
        const {code, data} = response.body
        expect(code).toBe(404);
    })

})
describe('put endpoint /sales/orders/:order_id',() => {
    test('it should be success to update order by id 3',async () => {
        const response = await request(app)
        .put(`${process.env.BASE_URL}/${process.env.URL_ROUTER_ORDER_SELLER}/orders/3`)
        .set('Authorization', 'Bearer ' + token)
        .send({
            'status' : 1
          })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        const {code, data} = response.body
        expect(code).toBe(200)
    })
    test('it should be failed to update order by id 100',async () => {
        const response = await request(app)
        .put(`${process.env.BASE_URL}/${process.env.URL_ROUTER_ORDER_SELLER}/orders/100`)
        .set('Authorization', 'Bearer ' + token)
        .send({
            'status' : 1
          })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        const {code, data} = response.body
        expect(code).toBe(404)
    })
    test('it should be failed to update order by id abc',async () => {
        const response = await request(app)
        .put(`${process.env.BASE_URL}/${process.env.URL_ROUTER_ORDER_SELLER}/orders/abc`)
        .set('Authorization', 'Bearer ' + token)
        .send({
            'status' : 1
          })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        const {code, data} = response.body
        expect(code).toBe(400)
    })
    test('it should be failed to update order by id 2 because it not his own ',async () => {
        const response = await request(app)
        .put(`${process.env.BASE_URL}/${process.env.URL_ROUTER_ORDER_SELLER}/orders/1`)
        .set('Authorization', 'Bearer ' + token)
        .send({
            'status' : 1
          })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        const {code, data} = response.body
        expect(code).toBe(401)
    })
})