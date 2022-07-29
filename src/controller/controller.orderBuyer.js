const response = require('./../utility/responseModel');
const {Product,Order,City,Product_image,User,Category,Notification_object,Notification} = require('./../models/');
const {Op} = require('sequelize');
const pagination = require('./../utility/pagination');
module.exports = {
    async createOrder(req,res) {
        try {
            const {seller_id,buyer_id,price,product_id} = req.body;
            const dataUserFromJWT = req.user;

            if (price < 99) {
                return res.status(400).json(response.error(400,'Minimal harga penawaran adalah Rp99'))
            }
            if (buyer_id !== dataUserFromJWT.id) {
                // Verifikasi apakah user yang membeli produk === user yang login
                return res.status(401).json(response.error(401,'Anda tidak memiliki akses'))
            }
            const findProduct = await Product.findOne({where : {id : product_id}});
            if (!findProduct) {
                // Verifikasi apakah product yang dibeli ada didatabase
                return res.status(404).json(response.error(404,'Product tidak ditemukan'))
            }
            if (findProduct.id_user !== seller_id) {
                // Verifikasi apakah user yang menjual sama dengan yang mengupload produk
                return res.status(400).json(response.error(400,'Data produk dengan seller tidak sesuai'))
            }
            if (findProduct.id_user === buyer_id) {
                // Verifikasi apakah user yang membeli product sama dengan yang menjualnya
                return res.status(400).json(response.error(400,'Tidak boleh membeli barang sendiri'))
            }
           if (findProduct.status === false || findProduct.isActive === false) {
                // Jika produknya tidak aktif / statusnya terjual maka user tidak bisa melakukan transaksi dengan produk tersebut
                return res.status(400).json(response.error(400,'produk tidak aktif atau sudah terjual'))
           }
           const findOrder = await Order.findOne({
            where : {
                buyer_id,
                product_id,
                status : {
                    [Op.or] : [null,1]
                },
                is_done : null 
            }
           })
           if (findOrder) {
            // Jika masih ada order yang sedang diproses maka tidak bisa melakukan order
            return res.status(400).json(response.error(400,`masih ada order yang belum selesai dengan jenis order yang sama di id order ${findOrder.id}`));
           }

            const dataOrder = await Order.create(req.body);

            const notifOrder = await Order.findOne({
                where: {
                    id: dataOrder.id
                }
            })

            // Mengecek Jika Order Berhasil di buat
            if(notifOrder){
                // membuat tabel Notification_object jika Order Berhasil Dibuat
                const createNotifObject = await Notification_object.create({
                    notification_type_id: 2,
                    product_id: null,
                    order_id: notifOrder.dataValues.id 
                })

                if(createNotifObject){
                    // membuat tabel Notification jika Ordet telah berhasil dibuat dan telah berhasil membuat tabel Notification_object
                    await Notification.create({
                        notification_object_id: createNotifObject.id,
                        user_id: notifOrder.dataValues.buyer_id,
                        status: 0
                    })

                    await Notification.create({
                        notification_object_id: createNotifObject.id,
                        user_id: notifOrder.dataValues.seller_id,
                        status: 0
                    })
                }
            }

            return res.status(201).json(response.success(201,'Harga tawaranmu berhasil dikirim ke penjual'))
        } catch (error) {
            console.error(error)
            res.status(500).json(response.error(500,'Internal Server Error'));
        }
    },
    async getAllOrder(req,res) {
        try {
             // pagination memiliki 2 parameter,page dan row
            // page diambil dari query,row di set ke 12
            const {page,row} = pagination(req.query.page,req.query.row);
            // Mengambil data user id yang login dari JWT 
            const idUser = req.user.id;
            const{status : statusOrder, done : isDone} = req.query;


            const options = {
                order: [
                    ['updatedAt', 'DESC'],
                ],
                where : {
                    buyer_id : idUser
                },
                include : [
                    {
                        model : User,
                        as : 'Buyers',
                        attributes: {exclude: ['email','phone_number','password','updatedAt']},
                        include : [
                            {
                                model : City,
                                attributes: {exclude: ['createdAt','updatedAt']}
                            }
                        ]
                    },
                    {
                        model : Product,
                        attributes:{exclude : ['createdAt','updatedAt']},
                        include: [
                            {
                                model: Product_image,
                                attributes: ['id', 'name', 'url_image', 'product_id']
                            },
                            {
                                model : Category,
                            }
                        ],
                        
                    },
                    {
                        model : User,
                        as : 'Sellers',
                        attributes: {exclude: ['email','phone_number','password','updatedAt']},
                        include : [
                            {
                                model : City,
                                attributes: {exclude: ['createdAt','updatedAt']}
                            }
                        ]
                    },
                ],
                offset : page,
                limit : row
            }
            if (statusOrder !== undefined && !isNaN(statusOrder) 
            && (statusOrder === 0 || statusOrder === 1)) {
                // Untuk filter by status order
                // statusOrder null = sedang diproses
                // statusOrder 1 = terjual
                // statusOrder 0 = dibatalkan
                if (statusOrder === 1 && isDone === undefined) {
                    options.where.is_done = null;
                }
                options.where.status = statusOrder;
            } 
            if (isDone !== undefined && !isNaN(isDone)
            && (isDone === 0 || isDone === 1)) {
                // untuk filter apakah transaksi sudah selesai apa belum
                // isDone null = sedang diproses
                // isDone 1 = selesai terjual
                // isDone 0 = selesai dibatalkan
                options.where.is_done = isDone;
            } else {
                options.where.is_done = null;
            }
            
            const findOrder = await Order.findAll(options);
            return res.status(200).json(response.success(200,findOrder));
        } catch (error) {
            console.log(error)
            return res.status(500).json(response.error(500,'Internal Server Error'))
        }
    },
    async getOrderById(req,res) {
        try {
            // Mengambil id order dari req.param 
            const orderId = req.params.order_id;
            // Mengambil id user dari JWT
            const idUser = req.user.id;

            const options = {
                where : {
                    // Convert it to number because the default is string
                    id : +orderId
                },
                include : [
                    {
                        model : User,
                        as : 'Buyers',
                        attributes: {exclude: ['email','phone_number','password','updatedAt']},
                        include : [
                            {
                                model : City,
                                attributes: {exclude: ['createdAt','updatedAt']}
                            }
                        ]
                    },
                    {
                        model : Product,
                        attributes:{exclude : ['createdAt','updatedAt']},
                        include: [
                            {
                                model: Product_image,
                                attributes: ['id', 'name', 'url_image', 'product_id']
                            },
                            {
                                model : Category,
                            }
                        ],
                        
                    },
                    {
                        model : User,
                        as : 'Sellers',
                        attributes: {exclude: ['email','phone_number','password','updatedAt']},
                        include : [
                            {
                                model : City,
                                attributes: {exclude: ['createdAt','updatedAt']}
                            }
                        ]
                    },
                ]
               
        }
        const findOrder = await Order.findOne(options);
        if (!findOrder) {
            // Cek apakah order dengan id x ditemukan
            return res.status(404).json(response.error(404,'order not found'))
        }
        if (findOrder.buyer_id !== idUser) {
            // Cek apakah order dengan id x adalah milik user yang login
            return res.status(401).json(response.error(401,'you dont have access'))
        }
        return res.status(200).json(response.success(200,findOrder));

        } catch (error) {
            console.error(error);
            return res.status(500).json(response.error(500,'Internal Server Error'))
        }
    }
    // async getOrderByProductId(req,res) {
    //     return res.status(200).json({'Hello' : 'HELLO'})
    // }
}