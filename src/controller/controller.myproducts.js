const { Product } = require('../models')
const { Product_image,User, Category, Notification_object, Notification } = require('../models');
const response = require('../utility/responseModel');
const cloudinary = require('../utility/cloudinary');
const pagination = require('./../utility/pagination');
const fs = require('fs')
const removeFileUploadedByMulter = (files) => {
    if (files || files.length !== 0) {
        files.forEach((file) => {
            console.log(file)
            fs.unlinkSync(`${file.path}`);
        })
    }
    
}


const dataProductAll = async (req, res) => {
    try{
        // Data user from JWT
        const dataUser = req.user;
        // Membuat Variabel page yang telah di inputkan user
        // 12 adalah row nya
        const {page,row} = pagination(req.query.page,req.query.row)
        // Mengikuti design yang ada di figma
        
        // opsi yang digunakakan untuk menampilkan product
        const options = {
            where : {
                // Mengambil data yang memang hanya diupload oleh user yang login
                id_user : dataUser.id
            },
            // membuat id yang ditampilkan berurutan
            order: [
                ['id', 'ASC'],
            ],
            // membuat agar yang di tampilkan hanya di dalam attribute
            attributes: ['id', 'name', 'price', 'description', 'isActive', 'status', 'id_user', 'id_category'],
                    // menampilkan foreig key product image yang ber primary key di product
                    include: [
                        {
                            model: Product_image,
                            attributes: ['id', 'name', 'url_image', 'product_id']
                        },
                        {
                            model : User,
                            attributes: {exclude: ['phone_number','email','password','updatedAt']},
                        },
                        {
                            model : Category
                        }
                    ],
            // membuat pagination 
            limit: row,
            offset: page
            
        }
        // Check apakah ada query filter by status 
        if (req.query.status) {
            let status = req.query.status.toLowerCase();
            if (status === 'true') {
                options.where.status = true
            } else if (status === 'false') {
                options.where.status = false
            } else {
                options.where.status = true
            }

        }
        // Check apakah ada query filter by status 
        if (req.query.isActive)  {
            let isActive = req.query.isActive.toLowerCase();
            if (isActive === 'true') {
                options.where.isActive = true
            } else if (isActive === 'false') {
                options.where.isActive = false
            } else {
                options.where.isActive = true
            }
        }
        // memangil semua data di tabel product dan foreign keynya 
        const getDataProductAll = await Product.findAll(options)

        if (!getDataProductAll || getDataProductAll.length === 0) {
            return res.status(404).json(response.error(404, 'Product not found'))
        }
    
        // menampilkan response semua data jika berhasil
        res.status(200).json(response.success(200, getDataProductAll))
    }catch(err){
        // menampilkan error di console log
        console.log(err)

        // menampilkan response semua data jika gagal
        return res.status(500).json(response.error(500, 'Internal Server Error'))
    }
   
}

const dataProductById = async (req, res) => {
    try{
        // Data user dari JWT
        const dataUser = req.user;
        // mengambil id yang dimasukan user lalu ditaru ke variabels
        const id_product = req.params.id

        // opsi mengecek jika id yang dimasukan cocok dengan id di database produk
        const optionsNotId = {
            where: {
                id: id_product,
                id_user : dataUser.id
            }
        }
    
        const idnull = await Product.findOne(optionsNotId)
    
        // error headling jika id tidak ditemukan
        if (idnull === null){
            return res.status(401).json(response.error(401,`id ${id_product} Tidak Ditemukan`));
        }  

        // opsi yang digunakakan untuk menampilkan product
        const options = {
            where: {
                id: id_product,
                id_user : dataUser.id

            },
            // membuat agar yang di tampilkan hanya di dalam attribute
            attributes: ['id', 'name', 'price', 'description', 'isActive', 'status', 'id_user', 'id_category'],
                    // menampilkan foreig key product image yang ber primary key di product
                    include: [
                        {
                            model: Product_image,
                            attributes: ['id', 'name', 'url_image', 'product_id']
                        },
                        {
                            model : User,
                            attributes: {exclude: ['phone_number','email','password','updatedAt']},
                        },
                        {
                            model : Category,
                        }
                    ]
        }

        // memangil satu data by id di tabel product dan foreign keynya
        const getDataProducTById = await Product.findOne(options)

        if (!getDataProducTById) {
            res.status(404).json(response.error(404, 'Product not found'))
        }

        // menampilkan response semua data jika berhasil
        res.status(200).json(response.success(200, getDataProducTById))


    }catch(err){
        // menampilkan error di console log
        console.log(err)

        // menampilkan response semua data jika gagal
        return res.status(500).json(response.error(500), 'Internal Server Error')
    }
}

const createDataProduct = async (req, res) => {
    try{
        // mengambil data user dari jwt
        const dataUserFromJWT = req.user.dataValues
        // validasi sesuai requirement,apakah profile user yang mau upload produk
        // sudah lengkap atau belum
        for (let props in dataUserFromJWT) {
            if (dataUserFromJWT[props] === null){
                const requiredData = ["phone_number","address","name","city_id"]
                if (requiredData.includes(props)) {
                    // Function remove ada dipaling atas
                    console.log('cek profile data')
                    removeFileUploadedByMulter(req.files);
                    return res.status(401).json(response.error(401,'Anda tidak memiliki akses,lengkapi profile terlebih dahulu'));
                }
            }
        }
        // deklarasi variabel yang telah dinputkan oleh user untuk database product
        const {name, price, description, isActive, status, id_user, id_category} = req.body

        // deklarasi gambar yang telah di input user
        const files = req.files;
        
        // error headling jika gambar yang dimasukan tidak ada tau lebih dari 4
        if (files.length > 4 || files.length === 0) {
            console.log('FILE KUANTITAS')
            // Function remove ada dipaling atas
            removeFileUploadedByMulter(req.files);
            return res.status(401).json(response.error(401, 'Gambar yang di masukan tidak boleh kosong dan lebih dari 4'))
        }

        // menyimpan data product yang dimasukan user ke variabel
        const dataMyProductInsertDatabase = {
            name: name,
            price: price,
            description: description,
            isActive: isActive,
            status: status,
            id_user: id_user,
            id_category: id_category
        }
        // Melakukan validasi apakah user yang mengupload produk = user yang login
        if (id_user !== dataUserFromJWT.id ) {
            console.log('data gak valid')

            // Function remove ada dipaling atas
            removeFileUploadedByMulter(req.files);
            return res.status(401).json(response.error(401,'Anda tidak memiliki akses'));
        }
        // Melakukan validasi apakah category dengan id_category ada didatabase
        const findCategory = await Category.findOne({
            where : {
                id : id_category
            }
        })
        if (!findCategory) {
            console.log('data gak valid')
            // Function remove ada dipaling atas
            removeFileUploadedByMulter(req.files);
            return res.status(400).json(response.error(400,'id_category tidak valid / tidak ditemukan'));
        }
        // Membuat Product ke database
        const createProduct = await Product.create(dataMyProductInsertDatabase)
        
        // error headling jika database product gagal di buat di database
        if (!createProduct) {
            console.log('gagal create product')
            // Function remove ada dipaling atas
            removeFileUploadedByMulter(req.files);
            return res.status(404).json(response.error(404,'Data Product Gagal dibuat'));
        }
        
        // untuk mendeklarasikan fungsi yang berada di cloudinary dengan async await 
        const uploader = async (path,opt) => await cloudinary.uploadCloudinary(path,opt)
        
        const dataMyProductImagesInsertDatabase = []
        // Set configurasi agar function menjadi reusable
        const optionsCloudinary = {
            type: "image",
            folder: "secondhand_app/image/products"
        }
        for(const file of files){
            // Mengambil lokasi file lalu mendeklarasikan ke variabel
            const {path} = file;
            // Mengambil name file lalu mendeklarasikan ke variabel
            const {originalname} = file;
            // memisahkan nama dan format gambar
            const nameImg = originalname.split('.')[0];
            // memanggil fungsi uploader untuk mengupload gambar ke cloudinary
            const newpath = await uploader(path,optionsCloudinary)

             // Mengambil url_gambar public_id product lalu mendeklarasikan ke variabel
            // const {secure_url, public_id} = newpath

             // Mendestructuring publicId sebagai profile_picture_id,dan url hasil optimisasi gambar
             const {public_id,eager} = newpath;
             // eager is the result of optimization image
             const secure_url = eager[0].secure_url;
            // menghapus file gambar setelah data gambar yang diperlukan telah disimpan di server agar tidak menyimpan banyak penyimpanan
            fs.unlinkSync(path)

            // menambahkan data yang igin dimasukan di tabel image product
            dataMyProductImagesInsertDatabase.push({
                name: nameImg,
                url_image: secure_url,
                product_id: createProduct.id,
                product_image_id: public_id
            })

        }


        // menambahkan data image product
        const createImagesProduct = await Product_image.bulkCreate(dataMyProductImagesInsertDatabase)

        if (!createImagesProduct) {
            console.log('gagal create image product product')
            // Function remove ada dipaling atas
            removeFileUploadedByMulter(req.files);
            res.status(404).json(response.error(404, 'Data Images Product Gagal Dibuat'))
        }

        // membuat variabel baru yang berisi data product yang telah berhasil di buat
        const dataProductSuccesCreate = await Product.findOne({
            where: {
                id: createProduct.id
            },
            attributes: ['id', 'name', 'price', 'description', 'isActive', 'status', 'id_user', 'id_category'],
                    include: [
                        {
                            model: Product_image,
                            attributes: ['id', 'name', 'url_image', 'product_id']
                        }
                    ]
        })

        // mengecek jika jika product telah diterbitkan
        if(dataProductSuccesCreate.dataValues.isActive === true) {
            // membuat tabel Notification_object jika product telah diterbitkan
            const createNotifObject = await Notification_object.create({
                notification_type_id: 1,
                product_id: dataProductSuccesCreate.dataValues.id,
                order_id: null 
            })

            if(createNotifObject){
                // membuat tabel Notification jika product telah diterbitkan dan telah berhasil membuat tabel Notification_object
                await Notification.create({
                    notification_object_id: createNotifObject.id,
                    user_id: dataProductSuccesCreate.dataValues.id_user,
                    status: 0
                })
            }
        }

        // response jika semua proses berhasil
        res.status(201).json(response.success(201,dataProductSuccesCreate))


    }catch(err){
        // menampilkan error pada console log
        console.log(err)
        // Function remove ada dipaling atas
        removeFileUploadedByMulter(req.files);
        // response error jika proses gagal
        return res.status(500).json(response.error(500,'Internal Server Error'));
    }
}

const updateDataProduct = async (req, res) => {
    try{
        // Mengambil data dari jwt
        const dataUserFromJWT = req.user

        // membuat variabel dengan value params id yang di input user
        const id_product = req.params.id

        // opsi yang digunakan untuk mengecek params id yang dimasukan user ada di database product image dengan attribute product_id
        const optionsNotId = {
            where: {
                id: id_product
            }
        }
    
        // membuat variabel dengan hasil pengecekan params id yang dimasukan user ada di database product image dengan attribute product_id atau tidak
        const idnull = await Product.findOne(optionsNotId)
    
        // mengakap error headling jika params id yang dimasukan user tidak ada
        if (idnull === null){
            // Function remove ada dipaling atas
            removeFileUploadedByMulter(req.files);
            return res.status(401).json(response.error(401,`id ${id_product} Tidak Ditemukan`));
        }  

        // deklarasi variabel yang telah dinputkan oleh user untuk database product
        const {name, price, description, isActive, status, id_user, id_category} = req.body

        // deklarasi gambar yang telah di input user
        const files = req.files;

        // opsi untuk mengupdate data pada product
        const options = {
                name: name,
                price: price,
                description: description,
                isActive: isActive,
                status: status,
                id_user: id_user,
                id_category: id_category
        }
        // Melakukan validasi apakah user yang mengupdate produk merupakan pemilik produk tersebut
        // idnull merupakan data produk yang dipakai saat mengecak apakah ada produk atau tidak
        if (idnull.id_user !== dataUserFromJWT.id) {
            // Function remove ada dipaling atas
            removeFileUploadedByMulter(req.files);
            return res.status(401).json(response.error(401,'Anda tidak memiliki akses'));
        }
        // Melakukan validasi apakah user yang mengupdate produk = user yang login
        if (id_user !== dataUserFromJWT.id ) {
            // Function remove ada dipaling atas
            removeFileUploadedByMulter(req.files);
            return res.status(401).json(response.error(401,'Anda tidak memiliki akses'));
        }
        // Cek apakah 
        // menangkap jika tidak ada gambar yang dimasukan
        if (files.length === 0) {
            
            // melakukan update pada tabel product sesuai id yang dimasukan
            const updateByProduct = await Product.update(options,
                {
                    where: {
                        id: id_product
                    }
                })

            // error headling jika data product gagal diperbarui
            if (updateByProduct === 0) {
                // Function remove ada dipaling atas
                removeFileUploadedByMulter(req.files);
                return res.status(404).json(response.success(404,'Data Product Gagal Di Perbarui'))
            }

            // mengecek jika jika product telah diterbitkan
            if(isActive === true) {
                // membuat tabel Notification_object jika product telah diterbitkan
                const createNotifObject = await Notification_object.create({
                    notification_type_id: 1,
                    product_id: idnull.dataValues.id,
                    order_id: null 
                })

                if(createNotifObject){
                    // membuat tabel Notification jika product telah diterbitkan dan telah berhasil membuat tabel Notification_object
                    await Notification.create({
                        notification_object_id: createNotifObject.id,
                        user_id: idnull.dataValues.id_user,
                        status: 0
                    })
                }
            }

            // response jika semua proses berhasil
            return res.status(200).json(response.success(200,'Data Product Berhasil Di Perbarui'))
        }

        // error headling jika gambar yang dimasukan tidak ada tau lebih dari 4
        if (files.length > 4) {
            // Function remove ada dipaling atas
            removeFileUploadedByMulter(req.files);
            return res.status(401).json(response.error(401, 'Gambar yang di masukan lebih dari 4'))
        }

        // update data Product jika user memasukan gambar
        const updateByProduct = await Product.update(options,
            {
                where: {
                    id: id_product
                }
            }
        )

        // error headling jika data product gagal dibuat
        if (updateByProduct === 0) {
            // Function remove ada dipaling atas
            removeFileUploadedByMulter(req.files);
            return res.status(404).json(response.success(404,'Data Product Gagal Di Perbarui'))
        }

        // mengecek semua data product image dengan product_id yang sesuai dengan inputan user
        const dataProductImage = await Product_image.findAll({
            where:{
                product_id: id_product
            }
        })

        
        // untuk mendeklarasikan fungsi upload dan delete gambar yang berada di cloudinary dengan async await 
        const uploader = async (path,opts) => await cloudinary.uploadCloudinary(path,opts)
        const deletee = async (path) => await cloudinary.deleteCloudinary(path)
        
        // menghapus image product yang berada di cloudinary
        for(const data of dataProductImage ){
            await deletee(data.product_image_id)
        }

        // membuat variabel untuk menampung data product image yang ingin di update 
        const dataMyProductImagesUpdateDatabase = []
        // Set configurasi agar function menjadi reusable
        const optionsCloudinary = {
            type: "image",
            folder: "secondhand_app/image/products"
        }
         for(const file of files){    
             // Mengambil lokasi file lalu mendeklarasikan ke variabel
             const {path} = file;
             // Mengambil name file lalu mendeklarasikan ke variabel
             const {originalname} = file;
             // memisahkan nama dan format gambar
             const nameImg = originalname.split('.')[0];
             // memanggil fungsi uploader
             const newpath = await uploader(path,optionsCloudinary)
              // Mengambil url_gambar product lalu mendeklarasikan ke variabel
            //  const {secure_url, public_id} = newpath
            // Mendestructuring publicId sebagai profile_picture_id,dan url hasil optimisasi gambar
            const {public_id,eager} = newpath;
            // eager is the result of optimization image
            const secure_url = eager[0].secure_url;
             // menghapus file gambar setelah data gambar yang diperlukan telah disimpan di server agar tidak menyimpan banyak penyimpanan
            fs.unlinkSync(path)
 
             dataMyProductImagesUpdateDatabase.push({
                 name: nameImg,
                 url_image: secure_url,
                 product_id: id_product,
                product_image_id: public_id
             })
             
         }

         // menghapus terlebih dahulu semua image productnya
         const DeleteProductImage = await Product_image.destroy({
             where: {
                 product_id: [id_product]
             }
         })
         
         // Error headling jika data gagal dibuat
         if (DeleteProductImage === 0) {
            // Function remove ada dipaling atas
            removeFileUploadedByMulter(req.files);
            return res.status(404).json(response.error(404,'Data gambar Product gagal Di Perbarui'))
         }

         // membuat product image sesuai id 
         const updataImagesProduct = await Product_image.bulkCreate(dataMyProductImagesUpdateDatabase)
 
          // Error headling jika data gagal dibuat
          if (updataImagesProduct === 0) {
            // Function remove ada dipaling atas
            removeFileUploadedByMulter(req.files);
             return res.status(404).json(response.error(404,'Data gambar Product gagal Di Perbarui'))
          }

        // mengecek jika jika product telah diterbitkan
        if(isActive === true) {
            // membuat tabel Notification_object jika product telah diterbitkan
            const createNotifObject = await Notification_object.create({
                notification_type_id: 1,
                product_id: idnull.dataValues.id,
                order_id: null 
            })

            if(createNotifObject){
                // membuat tabel Notification jika product telah diterbitkan dan telah berhasil membuat tabel Notification_object
                await Notification.create({
                    notification_object_id: createNotifObject.id,
                    user_id: idnull.dataValues.id_user,
                    status: 0
                })
            }
        }

        // response jika semua proses berhasil
        return res.status(200).json(response.success(200,'Data Product Berhasil Di Perbarui'))

    }catch(err){
        // Function remove ada dipaling atas
        removeFileUploadedByMulter(req.files);
        console.log(err)

        // response error jika proses gagal
        return res.status(500).json(response.error(500,'Internal Server Error'));
    }
}


const deleteDataProductById = async (req, res) => {
    try{
        const dataUserFromJWT = req.user;
        // Mengambil Id params yang dimasukan user
        const id_Product = req.params.id

        // opsi untuk mengecek id pada product
        const optionsNotId = {
            where: {
                id: id_Product
            }
        }
    
        // mendapatkan hasil jika ada tau tidaknya data product dengan id yang dimasukan user
        const idnull = await Product.findOne(optionsNotId)
    
        // membuat error headling jika tidak ada data product dengan id yag dimasukan error 
        if (idnull === null){
            return res.status(401).json(response.error(401,`id_product ${id_Product} Tidak Ditemukan`));
        }
         // Melakukan validasi apakah user yang menghapus produk merupakan pemilik produk tersebut
        // idnull merupakan data produk yang dipakai saat mengecak apakah ada produk atau tidak
        if (idnull.id_user !== dataUserFromJWT.id) {
            return res.status(401).json(response.error(401,'Anda tidak memiliki akses'));
        }
        // untuk mendeklarasikan fungsi yang berada di cloudinary dengan async await 
        const deletee = async (path) => await cloudinary.deleteCloudinary(path)

        // mengangkap semua data yang product id yang sesuai dengan inputan user
        const dataImageCloudinary = await Product_image.findAll({
            where: {
                product_id: id_Product
            }
        })

        // melakukan looping sesuai berapa id yang sama dimasukan user lalu menghapusnya di cloudinary
        for(const dataImage of dataImageCloudinary ){
            await deletee(dataImage.product_image_id)
        }

        // sebelunnya membuat product harus memasukan image jadi dipastikan product mempunyai image
        // Menghapus terlebih dahulu data image product karena jika dluan data product maka hanya attribute product id yang ke hapus di image product
        const deleteProductImage = await Product_image.destroy({
            where: {
                product_id : [id_Product]
            }
        })

        // mengangkap error headling jika data image product tidak berhasil dihapus
        if (deleteProductImage === 0) {
            return res.status(404).json(response.error(404, `Data Images Product dengan Product_id ${id_Product} Gagal Dihapus`))
        }

        // opsi untuk menghapus data product dengan berdasarkan id yang sama
        const options = {
            where: {
                id: [id_Product]
            }
        }

        // menghapus data product
        const deleteProduct = await Product.destroy(options)

        // menangkap error headling jika data product gagal di hapus
        if (deleteProduct === 0) {
            return res.status(404).json(response.error(404, `Data Product dengan id ${id_Product} Gagal Dihapus`))
        }
        
        // respon jika semua proses berhasil
        res.status(200).json(response.success(200, `Data Product dengan id ${id_Product} Berhasil Dihapus`))


    }catch(err){
        // menampilkan error pada console log
        console.log(err)

        // response error jika proses gagal
        return res.status(500).json(response.error(500, 'Internal Server Error'))
    }
}

module.exports = {
    dataProductAll,
    dataProductById,
    createDataProduct,
    updateDataProduct,
    deleteDataProductById
}