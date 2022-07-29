const app = require('../app')
const request = require('supertest')

let token = null;
let id = 1;
// Login terlebih dahulu agar bisa mengakses update profile
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

describe('Endpoint Profile Update', () => {
    // Positif Test
    test('update profile user Not Image', async() => {
        const response = await request(app)
        .put(`${process.env.BASE_URL}/${process.env.URL_ROUTER_PROFILE}/${id}`)
        .set('content-type', 'multipart/form-data')
        .set('Authorization', 'Bearer ' + token)
        .field('name', 'Rizky')
        .field('city_id', 1)
        .field('phone_number', '085696241231')
        .field('address', 'Kota')

        const {code, data} = response.body
        expect(code).toBe(200);
        expect(data).toBe('Success update data')
    })

    test('update profile user Image', async() => {
        const response = await request(app)
        .put(`${process.env.BASE_URL}/${process.env.URL_ROUTER_PROFILE}/${id}`)
        .set('content-type', 'multipart/form-data')
        .set('Authorization', 'Bearer ' + token)
        .field('name', 'Rizky')
        .field('city_id', 1)
        .field('phone_number', '085696241231')
        .field('address', 'Kota')
        .attach('profile_picture', `${__dirname}/upload.jpg`)

        const {code, data} = response.body
        expect(code).toBe(200);
        expect(data).toBe('Success update data')
    }, 50000)


    // Negatif Test
    test('update profile tidak meiliki akses', async() => {
        const response = await request(app)
        .put(`${process.env.BASE_URL}/${process.env.URL_ROUTER_PROFILE}/100`)
        .set('content-type', 'multipart/form-data')
        .set('Authorization', 'Bearer ' + token)
        .field('name', 'Rizky')
        .field('city_id', 1)
        .field('phone_number', '085696241231')
        .field('address', 'Kota')
        .attach('profile_picture', `${__dirname}/upload.jpg`)

        const {code, message} = response.body
        expect(code).toBe(401);
        expect(message).toBe('Anda tidak memiliki akses')
    })
})

describe('Endpoint Profile Get ById', () => {
    // Positif Test
    test('Get By Id Success', async() => {
        const response = await request(app)
        .get(`${process.env.BASE_URL}/${process.env.URL_ROUTER_PROFILE}/${id}`)
        .set('Authorization', 'Bearer ' + token)
        const {code, data} = response.body
        expect(code).toBe(200);
    })

    // Negatif Test
    test('Get By Id not found', async() => {
        const response = await request(app)
        .get(`${process.env.BASE_URL}/${process.env.URL_ROUTER_PROFILE}/100`)
        .set('Authorization', 'Bearer ' + token)
        const {code, message} = response.body
        expect(code).toBe(404);
        expect(message).toBe('User not found')
    })

    test('Get By Id Internal Server', async() => {
        const response = await request(app)
        .get(`${process.env.BASE_URL}/${process.env.URL_ROUTER_PROFILE}/${null}`)
        .set('Authorization', 'Bearer ' + token)
        const {code, message} = response.body
        expect(code).toBe(500);
        expect(message).toBe('Internal Server Error')
    })
})
