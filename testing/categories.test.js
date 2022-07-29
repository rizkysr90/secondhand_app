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

describe('Endpoint Get All Categories', () => {
    // Positif test
    test('Get All Categories success', async() => {
        const response = await request(app)
        .get(`${process.env.BASE_URL}${process.env.URL_ROUTER_CATEGORIES}?page=1`)
        .set('Authorization', 'Bearer ' + token)
        const {code, data} = response.body
        expect(code).toBe(200);
    })
    // Negatif Test
    test('Get All Categories Internal Server', async() => {
        const response = await request(app)
        .get(`${process.env.BASE_URL}${process.env.URL_ROUTER_CATEGORIES}?page=`)
        .set('Authorization', 'Bearer ' + token)
        const {code, message} = response.body
        expect(code).toBe(500);
        expect(message).toBe('Internal Server Error')
    })
})

describe('Endpoint Get id Categories', () => {
    const id = 1; 
    // Positif test
    test('Get Id Categories success', async() => {
        const response = await request(app)
        .get(`${process.env.BASE_URL}${process.env.URL_ROUTER_CATEGORIES}/${id}`)
        .set('Authorization', 'Bearer ' + token)
        const {code, data} = response.body
        expect(code).toBe(200);
    })
    // Negatif Test
    test('Get Id Categories dengan ID 1000 Tidak Ditemukan', async() => {
        const response = await request(app)
        .get(`${process.env.BASE_URL}${process.env.URL_ROUTER_CATEGORIES}/${1000}`)
        .set('Authorization', 'Bearer ' + token)
        const {code, message} = response.body
        expect(code).toBe(401);
        expect(message).toBe('Category dengan ID 1000 Tidak Ditemukan')
    })
    test('Get Id Categories Internal Server', async() => {
        const response = await request(app)
        .get(`${process.env.BASE_URL}${process.env.URL_ROUTER_CATEGORIES}/${null}`)
        .set('Authorization', 'Bearer ' + token)
        const {code, message} = response.body
        expect(code).toBe(500);
        expect(message).toBe('Internal Server Error')
    })
})

describe('Endpoint Create Categories', () => {
    // Positif test
    test('Create Categories success', async() => {
        const response = await request(app)
        .post(`${process.env.BASE_URL}${process.env.URL_ROUTER_CATEGORIES}`)
        .set('content-type', 'multipart/form-data')
        .set('Authorization', 'Bearer ' + token)
        .field('category_id', 1)
        .field('name', 'Sepatu')
        .field('isActive', true)
        .attach('image', `${__dirname}/upload.jpg`)

        const {code, data} = response.body
        expect(code).toBe(201)
        expect(data).toBe('Succes add data')
    },50000)
})


describe('Endpoint Update Categories', () => {
    // Positif test
    const id = 2;
    test('Update Categories success', async() => {
        const response = await request(app)
        .put(`${process.env.BASE_URL}${process.env.URL_ROUTER_CATEGORIES}/${id}`)
        .set('content-type', 'multipart/form-data')
        .set('Authorization', 'Bearer ' + token)
        .field('name', 'Baju')
        .field('isActive', false)
        .attach('image', `${__dirname}/Pengertian-Bahasa-Pemrograman.jpeg`)
        const {code, data} = response.body
        
        expect(code).toBe(201)
        expect(data).toBe('Sukses update data')
    })

    test('Update Categories success Not Image', async() => {
        const response = await request(app)
        .put(`${process.env.BASE_URL}${process.env.URL_ROUTER_CATEGORIES}/${id}`)
        .set('content-type', 'multipart/form-data')
        .set('Authorization', 'Bearer ' + token)
        .field('name', 'Baju')
        .field('isActive', true)

        const {code, data} = response.body
        expect(code).toBe(200)
        expect(data).toBe('Sukses update data')
    })
    //Negatif Test
    test('Update Categories not found', async() => {
        const response = await request(app)
        .put(`${process.env.BASE_URL}${process.env.URL_ROUTER_CATEGORIES}/${40000}`)
        .set('content-type', 'multipart/form-data')
        .set('Authorization', 'Bearer ' + token)
        .field('name', 'Baju')
        .field('isActive', false)

        const {code, message} = response.body

        expect(code).toBe(404)
        expect(message).toBe('Category not found')
    })
})

describe('Endpoint Delete Categories', () => {
    // Positif test
    const id = 2;
    test('Delete Categories success', async() => {
        const response = await request(app)
        .delete(`${process.env.BASE_URL}${process.env.URL_ROUTER_CATEGORIES}/${id}`)
        .set('Authorization', 'Bearer ' + token)

        const {code, data} = response.body

        expect(code).toBe(200)
        expect(data).toBe(`Data Category dengan id ${id} Berhasil Dihapus`)
    })
    // Negatif Test
    test('Delete Categories id_category Tidak Ditemukan', async() => {
        const response = await request(app)
        .delete(`${process.env.BASE_URL}${process.env.URL_ROUTER_CATEGORIES}/${10000}`)
        .set('Authorization', 'Bearer ' + token)

        const {code, message} = response.body

        expect(code).toBe(404)
        expect(message).toBe(`id_category ${10000} Tidak Ditemukan`)
    })

    test('Delete Categories Internal Server', async() => {
        const response = await request(app)
        .delete(`${process.env.BASE_URL}${process.env.URL_ROUTER_CATEGORIES}/${null}`)
        .set('Authorization', 'Bearer ' + token)

        const {code, message} = response.body

        expect(code).toBe(500)
        expect(message).toBe('Internal Server Error')
    })
})