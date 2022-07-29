const { Product } = require('../models')
const { Product_image,User,Category,Order } = require('../models');
const response = require('../utility/responseModel');
const pagination = require('./../utility/pagination');
const { Op } = require('sequelize');

const getProductAll = async (req, res) => {
    try{
        // Membuat Variabel page yang telah di inputkan user
        // 12 adalah row nya
        const {page,row} = pagination(req.query.page,req.query.row)
        const categoryIdByQuery = +req.query.category;
        const searchByNameQuery = req.query.search;
        
        // Mengikuti design yang ada di figma
        // opsi yang digunakakan untuk menampilkan user 
        const options = {
            where: {
                isActive: true,
                status: true
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
        // Handle jika ada query category
        if (categoryIdByQuery) {
            options.where.id_category = categoryIdByQuery;
        }
        // Handle jika ada query search
        if (searchByNameQuery) {
            options.where.name =  {
                [Op.iLike]: `%${searchByNameQuery}%`
            }
        }
        // memangil semua data di tabel product dan foreign keynya 
        const getDataProductAll = await Product.findAll(options)

        // if(getDataProductAll.length === 0 || !getDataProductAll){
        //     return res.status(404).json(response.error(404, 'Product not found'))
        // }
    
        // menampilkan response semua data jika berhasil
        res.status(200).json(response.success(200, getDataProductAll))
    }catch(err){
        // menampilkan error di console log
        console.log(err)

        // menampilkan response semua data jika gagal
        return res.status(500).json(response.error(500, 'Internal Server Error'))
    }
}
const getProducById = async (req, res) => {
    try{
        // mengambil id yang dimasukan user lalu ditaru ke variabels
        const id_product = req.params.id

        // opsi mengecek jika id yang dimasukan cocok dengan id di database produk
        const optionsNotId = {
            where: {
                id: id_product
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

        if (!getDataProducTById || getDataProducTById.length === 0) {
            res.status(404).json(response.error(404, 'Product not found'))
        }

        // menampilkan response semua data jika berhasil
        res.status(200).json(response.success(200, getDataProducTById))


    }catch(err){
        // menampilkan error di console log
        console.log(err)

        // menampilkan response semua data jika gagal
        return res.status(500).json(response.error(500, 'Internal Server Error'))
    }
}

const onProcess = async (req,res) => {
    try {
        // mendapatkan data id user melalui JWT token
        const idUser = req.user.id;
        const {product_id} = req.params

        if (isNaN(product_id)) {
            return res.status(400).json(response.error('400','url product_id harus integer'))
        }
        const findOrder = await Order.findOne({
        where : {
            buyer_id : idUser,
            product_id,
            status : {
                [Op.or] : [null,1]
            },
            is_done : null 
        }
        })
        if (findOrder) {
            // Jika masih ada order yang sedang diproses maka tidak bisa melakukan order
            return res.status(200).json(response.success(200,{onProcess : 1}));
        }
        return res.status(200).json(response.success(200,{onProcess : 0}))
    } catch (error) {
        console.error(error);
        return res.status(500).json(response.error(500,'Internal Server Error'));
    }
}





module.exports = {
    getProductAll,
    getProducById,
    onProcess
}