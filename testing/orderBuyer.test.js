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

describe('Endpoint Create Order Buyer', () => {
    // Positif test
    test('Create Order Buyer success', async() => {
        const response = await request(app)
        .post(`${process.env.BASE_URL}${process.env.URL_ROUTER_ORDER_BUYER}${process.env.URL_ROUTER_ORDER}`)
        .set('Authorization', 'Bearer ' + token)
        .send({
            buyer_id: 1,
            seller_id : 2,
            price: 500000,
            product_id: 7
        })
        .set('Accept', 'application/json')
        const {code, data} = response.body
        expect(code).toBe(201)
        expect(data).toBe('Harga tawaranmu berhasil dikirim ke penjual')
    })
    // Negatif Test
    test('Create Order Buyer Failed Minimal harga penawaran', async() => {
        const response = await request(app)
        .post(`${process.env.BASE_URL}${process.env.URL_ROUTER_ORDER_BUYER}${process.env.URL_ROUTER_ORDER}`)
        .set('Authorization', 'Bearer ' + token)
        .send({
            buyer_id: 1,
            seller_id : 2,
            price: 50,
            product_id: 7
        })
        .set('Accept', 'application/json')
        const {code, message} = response.body
        expect(code).toBe(400)
        expect(message).toBe('Minimal harga penawaran adalah Rp99')
    })

    test('Create Order Buyer Failed tidak memiliki akses', async() => {
        const response = await request(app)
        .post(`${process.env.BASE_URL}${process.env.URL_ROUTER_ORDER_BUYER}${process.env.URL_ROUTER_ORDER}`)
        .set('Authorization', 'Bearer ' + token)
        .send({
            buyer_id: 2,
            seller_id : 1,
            price: 50000,
            product_id: 7
        })
        .set('Accept', 'application/json')
        const {code, message} = response.body
        expect(code).toBe(401)
        expect(message).toBe('Anda tidak memiliki akses')
    })

    test('Create Order Buyer tidak ditemukan', async() => {
        const response = await request(app)
        .post(`${process.env.BASE_URL}${process.env.URL_ROUTER_ORDER_BUYER}${process.env.URL_ROUTER_ORDER}`)
        .set('Authorization', 'Bearer ' + token)
        .send({
            buyer_id: 1,
            seller_id : 6,
            price: 50000,
            product_id: 31
        })
        .set('Accept', 'application/json')
        const {code, message} = response.body
        expect(code).toBe(404)
        expect(message).toBe('Product tidak ditemukan')
    })

    test('Create Order Buyer Data produk dengan seller tidak sesuai', async() => {
        const response = await request(app)
        .post(`${process.env.BASE_URL}${process.env.URL_ROUTER_ORDER_BUYER}${process.env.URL_ROUTER_ORDER}`)
        .set('Authorization', 'Bearer ' + token)
        .send({
            buyer_id: 1,
            seller_id : 4,
            price: 100000,
            product_id: 7
        })
        .set('Accept', 'application/json')
        const {code, message} = response.body
        expect(code).toBe(400)
        expect(message).toBe('Data produk dengan seller tidak sesuai')
    })

    test('Create Order Buyer Failed Tidak boleh membeli barang sendiri', async() => {
        const response = await request(app)
        .post(`${process.env.BASE_URL}${process.env.URL_ROUTER_ORDER_BUYER}${process.env.URL_ROUTER_ORDER}`)
        .set('Authorization', 'Bearer ' + token)
        .send({
            buyer_id: 1,
            seller_id : 1,
            price: 100000,
            product_id: 1
        })
        .set('Accept', 'application/json')
        const {code, message} = response.body
        expect(code).toBe(400)
        expect(message).toBe('Tidak boleh membeli barang sendiri')
    })

    test('Create Order Buyer Failed produk tidak aktif atau sudah terjual', async() => {
        const response = await request(app)
        .post(`${process.env.BASE_URL}${process.env.URL_ROUTER_ORDER_BUYER}${process.env.URL_ROUTER_ORDER}`)
        .set('Authorization', 'Bearer ' + token)
        .send({
            buyer_id: 1,
            seller_id : 4,
            price: 1000000,
            product_id: 10
        })
        .set('Accept', 'application/json')
        const {code, message} = response.body
        expect(code).toBe(400)
        expect(message).toBe('produk tidak aktif atau sudah terjual')
    })

    test('Create Order Buyer Order Sama', async() => {
        const response = await request(app)
        .post(`${process.env.BASE_URL}${process.env.URL_ROUTER_ORDER_BUYER}${process.env.URL_ROUTER_ORDER}`)
        .set('Authorization', 'Bearer ' + token)
        .send({
            buyer_id: 1,
            seller_id : 2,
            price: 50000,
            product_id: 8
        })
        .set('Accept', 'application/json')
        const {code, message} = response.body
        expect(code).toBe(400)
        expect(message).toBe('masih ada order yang belum selesai dengan jenis order yang sama di id order 1')
    })
})

describe('Endpoint Gel All Order Buyer', () => {
    // Positif test
    test('Get All Order Buyer success', async() => {
        const response = await request(app)
        .get(`${process.env.BASE_URL}${process.env.URL_ROUTER_ORDER_BUYER}?page=1&row=12`)
        .set('Authorization', 'Bearer ' + token)

        const {code, data} = response.body
        expect(code).toBe(200)
    })

    test('Get All Order Buyer Pesanan Sedang di proses', async() => {
        const response = await request(app)
        .get(`${process.env.BASE_URL}${process.env.URL_ROUTER_ORDER_BUYER}?page=1&row=12&status=1`)
        .set('Authorization', 'Bearer ' + token)

        const {code, data} = response.body
        expect(code).toBe(200)
    })

    test('Get All Order Buyer Pesanan di tolak', async() => {
        const response = await request(app)
        .get(`${process.env.BASE_URL}${process.env.URL_ROUTER_ORDER_BUYER}?page=1&row=12&done=0`)
        .set('Authorization', 'Bearer ' + token)

        const {code, data} = response.body
        expect(code).toBe(200)
    })

    test('Get All Order Buyer Pesanan Success', async() => {
        const response = await request(app)
        .get(`${process.env.BASE_URL}${process.env.URL_ROUTER_ORDER_BUYER}?page=1&row=12&done=1`)
        .set('Authorization', 'Bearer ' + token)

        const {code, data} = response.body
        expect(code).toBe(200)
    })
})

describe('Endpoint Gel id Order Buyer', () => {
    // Positif test
    const id = 1;
    test('Get id Order Buyer success', async() => {
        const response = await request(app)
        .get(`${process.env.BASE_URL}${process.env.URL_ROUTER_ORDER_BUYER}${process.env.URL_ROUTER_ORDER}/${id}`)
        .set('Authorization', 'Bearer ' + token)

        const {code, data} = response.body
        expect(code).toBe(200)
    })
    // Negatif Test
    test('Get id Order Buyer Failed order not found', async() => {
        const response = await request(app)
        .get(`${process.env.BASE_URL}${process.env.URL_ROUTER_ORDER_BUYER}${process.env.URL_ROUTER_ORDER}/${1000}`)
        .set('Authorization', 'Bearer ' + token)

        const {code, message} = response.body
        expect(code).toBe(404)
        expect(message).toBe('order not found')
    })

    test('Get id Order Buyer Failed you dont have access', async() => {
        const response = await request(app)
        .get(`${process.env.BASE_URL}${process.env.URL_ROUTER_ORDER_BUYER}${process.env.URL_ROUTER_ORDER}/${3}`)
        .set('Authorization', 'Bearer ' + token)

        const {code, message} = response.body
        expect(code).toBe(401)
        expect(message).toBe('you dont have access')
    })
})