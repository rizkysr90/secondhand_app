const app = require('../app')
const request = require('supertest')

let token = null;
let newCreatedProductId = 0;
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

  describe('Endpoint myproduct Get By All', () => {
      // Positif Test
        test('Get By All myproduct success', async() => {
            const response = await request(app)
            .get(`${process.env.BASE_URL}/${process.env.URL_ROUTER_MYPRODUCT}?page=1row=10`)
            .set('Authorization', 'Bearer ' + token)
            
            const {code, data} = response.body
            expect(code).toBe(200);
        })

        test('Get By All Terhual myproduct success', async() => {
            const response = await request(app)
            .get(`${process.env.BASE_URL}/${process.env.URL_ROUTER_MYPRODUCT}?page=1row=10&status=false&isActive=false`)
            .set('Authorization', 'Bearer ' + token)
            
            const {code, data} = response.body
            expect(code).toBe(200);
        })

        // Negatif Test
        test('Get By All myproduct not found', async() => {
            const response = await request(app)
            .get(`${process.env.BASE_URL}/${process.env.URL_ROUTER_MYPRODUCT}?page=100&row=10&status=true&isActive=true`)
            .set('Authorization', 'Bearer ' + token)
            const {code, message} = response.body
            expect(code).toBe(404)
            expect(message).toBe('Product not found');
        })
  })

describe('Endpoint myproduct Get By id', () => {
    // Positif Test
    test('Get By id myproduct success', async() => {
        const response = await request(app)
        .get(`${process.env.BASE_URL}/${process.env.URL_ROUTER_MYPRODUCT}/1`)
        .set('Authorization', 'Bearer ' + token)
        const {code, data} = response.body
        expect(code).toBe(200);
    })

     // Negatif Test
     test('Get By id myproduct Tidak Ditemukan', async() => {
         const id = 100;
        const response = await request(app)
        .get(`${process.env.BASE_URL}/${process.env.URL_ROUTER_MYPRODUCT}/${id}`)
        .set('Authorization', 'Bearer ' + token)
        const {code, message} = response.body
        expect(code).toBe(401)
        expect(message).toBe(`id ${id} Tidak Ditemukan`);
    })
})

describe('Endpoint myproduct Create', () => {
    // Positif Test
    test('Create myproduct Success', async() => {
        const response = await request(app)
        .post(`${process.env.BASE_URL}/${process.env.URL_ROUTER_MYPRODUCT}`)
        .set('content-type', 'multipart/form-data')
        .set('Authorization', 'Bearer ' + token)
        .field('name', 'Rizky')
        .field('price', 250000)
        .field('description', 'jam Tangan bekas')
        .field('isActive', true)
        .field('status', true)
        .field('id_user', 1)
        .field('id_category', 1)
        .attach('gambar', `${__dirname}/upload.jpg`)
        .attach('gambar', `${__dirname}/Pengertian-Bahasa-Pemrograman.jpeg`)
        .attach('gambar', `${__dirname}/Screenshot.png`)


        const {code, data} = response.body
        newCreatedProductId = data.id;
        expect(code).toBe(201);
    }, 50000)

    // Negatif Test
    test('Create myproduct Failed image = 0 or image > 3', async() => {
        const response = await request(app)
        .post(`${process.env.BASE_URL}/${process.env.URL_ROUTER_MYPRODUCT}`)
        .set('content-type', 'multipart/form-data')
        .set('Authorization', 'Bearer ' + token)
        .field('name', 'Gian')
        .field('price', 350000)
        .field('description', 'jam Tangan')
        .field('isActive', true)
        .field('status', true)
        .field('id_user', 1)
        .field('id_category', 2)
        .attach('gambar', `${__dirname}/upload.jpg`)
        .attach('gambar', `${__dirname}/Pengertian-Bahasa-Pemrograman.jpeg`)
        .attach('gambar', `${__dirname}/Screenshot.png`)
        .attach('gambar', `${__dirname}/Screenshot.png`)
        .attach('gambar', `${__dirname}/Screenshot.png`)

        const {code, message} = response.body
        expect(code).toBe(401)
        expect(message).toBe('Gambar yang di masukan tidak boleh kosong dan lebih dari 4')

    }, 50000)
})

describe('Endpoint myproduct update', () => {
    // Positif Test
    const id = 1;
    test('update with image myproduct Success', async() => {
        const response = await request(app)
        .put(`${process.env.BASE_URL}/${process.env.URL_ROUTER_MYPRODUCT}/${newCreatedProductId}`)
        .set('content-type', 'multipart/form-data')
        .set('Authorization', 'Bearer ' + token)
        .field('name', 'Rizky')
        .field('price', 250000)
        .field('description', 'jam Tangan bekas')
        .field('isActive', true)
        .field('status', false)
        .field('id_user', 1)
        .field('id_category', 1)
        .attach('gambar', `${__dirname}/upload.jpg`)
        .attach('gambar', `${__dirname}/Pengertian-Bahasa-Pemrograman.jpeg`)
        .attach('gambar', `${__dirname}/Screenshot.png`)


        const {code, data} = response.body
        console.log(response.body)
        expect(code).toBe(200);
        expect(data).toBe('Data Product Berhasil Di Perbarui')
    }, 50000)

    test('update not with image myproduct Success', async() => {
        const response = await request(app)
        .put(`${process.env.BASE_URL}/${process.env.URL_ROUTER_MYPRODUCT}/${id}`)
        .set('content-type', 'multipart/form-data')
        .set('Authorization', 'Bearer ' + token)
        .field('name', 'Rizky')
        .field('price', 250000)
        .field('description', 'jam Tangan bekas')
        .field('isActive', true)
        .field('status', true)
        .field('id_user', 1)
        .field('id_category', 1)

        const {code, data} = response.body
        expect(code).toBe(200);
        expect(data).toBe('Data Product Berhasil Di Perbarui')
    }, 50000)

    // Negatif Test
    test('update image myproduct Failed', async() => {
        const id = 100
        const response = await request(app)
        .put(`${process.env.BASE_URL}/${process.env.URL_ROUTER_MYPRODUCT}/${id}`)
        .set('content-type', 'multipart/form-data')
        .set('Authorization', 'Bearer ' + token)
        .field('name', 'Gian')
        .field('price', 350000)
        .field('description', 'jam Tangan')
        .field('isActive', true)
        .field('status', true)
        .field('id_user', 1)
        .field('id_category', 2)
        .attach('gambar', `${__dirname}/upload.jpg`)
        .attach('gambar', `${__dirname}/Pengertian-Bahasa-Pemrograman.jpeg`)
        .attach('gambar', `${__dirname}/Screenshot.png`)

        const {code, message} = response.body
        expect(code).toBe(401);
        expect(message).toBe(`id ${id} Tidak Ditemukan`);

    }, 50000)

    test('update with image myproduct Failed image = 0 or image > 4', async() => {
    const id = 1
        const response = await request(app)
        .put(`${process.env.BASE_URL}/${process.env.URL_ROUTER_MYPRODUCT}/${id}`)
        .set('content-type', 'multipart/form-data')
        .set('Authorization', 'Bearer ' + token)
        .field('name', 'Gian')
        .field('price', 350000)
        .field('description', 'jam Tangan')
        .field('isActive', true)
        .field('status', true)
        .field('id_user', 1)
        .field('id_category', 2)
        .attach('gambar', `${__dirname}/upload.jpg`)
        .attach('gambar', `${__dirname}/Pengertian-Bahasa-Pemrograman.jpeg`)
        .attach('gambar', `${__dirname}/Screenshot.png`)
        .attach('gambar', `${__dirname}/Screenshot.png`)
        .attach('gambar', `${__dirname}/Screenshot.png`)
        .attach('gambar', `${__dirname}/Screenshot.png`)

        const {code, message} = response.body
        expect(code).toBe(401);
        expect(message).toBe(`Gambar yang di masukan lebih dari 4`);

    }, 50000)
})

describe('Endpoint myproduct delete', () => {
    // Positif Test
    test('delete myproduct Success', async() => {
        const id = newCreatedProductId;
        const response = await request(app)
        .delete(`${process.env.BASE_URL}/${process.env.URL_ROUTER_MYPRODUCT}/${id}`)
        .set('Authorization', 'Bearer ' + token)
        const {code, data} = response.body
        expect(code).toBe(200)
        expect(data).toBe(`Data Product dengan id ${id} Berhasil Dihapus`)
    }, 50000)

    // Negatif Test
    test('delete myproduct Success id tidak ditemukan', async() => {
        const id = 200;
        const response = await request(app)
        .delete(`${process.env.BASE_URL}/${process.env.URL_ROUTER_MYPRODUCT}/${id}`)
        .set('Authorization', 'Bearer ' + token)

        const {code, message} = response.body
        expect(code).toBe(401)
        expect(message).toBe(`id_product ${id} Tidak Ditemukan`)
    })

})