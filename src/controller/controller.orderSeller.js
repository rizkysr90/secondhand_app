const response = require('./../utility/responseModel');
const pagination =require('./../utility/pagination');
const {Order,City,User,Product,Product_image,Category,sequelize,Notification_object,Notification} = require('./../models/');
const { Op } = require('sequelize');
const queryInterface = sequelize.getQueryInterface();

const getAllOrder = async (req,res) => {
    try {
        // Logika untuk pagination
        
        const {page,row} = pagination(req.query.page,req.query.row);
        // status query untuk filter berdasarkan status order
        const{status : statusOrder, done : isDone} = req.query;
        // mengambil data user yang login
        const dataUser = req.user;
        const options = {
            where : {
                seller_id : dataUser.id,
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
            limit : row,
            order: [
                ['updatedAt', 'DESC'],
            ]

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
        const findSales =  await Order.findAll(options);
        return res.status(200).json(response.success(200,findSales));
    } catch (error) {
        console.error(error);
        return res.status(500).json(response.error(500,'Internal Server Error'));
    }
}

const getByIdOrder = async (req,res) => {
    try {
        if (req.params.order_id !== undefined && isNaN(req.params.order_id)) {
            // order_id tidak boleh string / harus integer
            return res.status(400).json(response.error(400,'order id tidak boleh string'))
        }
        // Mengambil id order dari req.param 

        const orderId = req.params.order_id;
        // Mengambil id user dari JWT
        const idUser = req.user.id;

        const options = {
            where : {
                // Convert it to number because the default is string
                id : +orderId,

            },
            include : [
                {
                    model : User,
                    as : 'Buyers',
                    attributes: {exclude: ['password','updatedAt']},
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
    if (findOrder.seller_id !== idUser) {
        // Cek apakah order yang masuk dengan id x adalah milik user yang login sebagai penjual
        return res.status(401).json(response.error(401,'you dont have access'))
    }
    // Jika order belum sukses maka tidak boleh mengembalikan email dan phone number
    let dataBuyer = findOrder.dataValues
    if (dataBuyer.status !== 1) {    
        delete dataBuyer.Buyers.dataValues.email
        delete dataBuyer.Buyers.dataValues.phone_number    
    }
    return res.status(200).json(response.success(200,dataBuyer));

    } catch (error) {
        console.error(error);
        return res.status(500).json(response.error(500,'Internal Server Error'))
    }

}
const updateOrder = async (req,res) => {
    try {
        if (req.params.order_id !== undefined && isNaN(req.params.order_id)) {
            // order_id tidak boleh string / harus integer
            return res.status(400).json(response.error(400,'order id tidak boleh string'))
        }
        const {order_id : orderId} = req.params;
        const {status} = req.body;
        const {id : userId} = req.user;
        const findOrder = await Order.findOne({
            where : {
                id : orderId
            }
        })
        if (!findOrder) {
            // Cek apakah order dengan id x ditemukan
            return res.status(404).json(response.error(404,'order not found'))
        }
        if (findOrder.seller_id !== userId) {
            // Cek apakah order yang masuk dengan id x adalah milik user yang login sebagai penjual
            return res.status(401).json(response.error(401,'you dont have access'))
        }
        if (findOrder.is_done !== null || findOrder.status !== null) {
            // Cek apakah order sudah selesai transaksi atau belum
            return res.status(401).json(response.error(401,'order sedang diproses atau order telah selesai,anda tidak bisa merubahnya lagi'))
        }
        const options = {
            where : {
                id : orderId
            }
        }
        let dataToBeUpdated = {
            status
        }
        if (status === 0) {
            // Kalau statusnya dibatalkan oleh penjual maka transaksi seleseai
            // dengan status 0 atau dibatalkan
            dataToBeUpdated.is_done = 0
        }
        await Order.update(dataToBeUpdated,options)

        // Melihat Apakah data Order Telah Berhasil Di Terima
        const checkDataOrder = await Order.findOne({
            where: {
                id: orderId,
                status: 1
            }
        })

        if(checkDataOrder){
            // membuat tabel Notification_object jika order telah diterima
            const createNotifObject = await Notification_object.create({
                notification_type_id: 3,
                product_id: null,
                order_id: checkDataOrder.dataValues.id 
            })

            if(createNotifObject){
                // membuat tabel Notification jika order telah diterima dan telah berhasil membuat tabel Notification_object
                await Notification.create({
                    notification_object_id: createNotifObject.id,
                    user_id: checkDataOrder.dataValues.buyer_id,
                    status: 0
                })
            }
        }

        return res.status(200).json(response.success(200,'sukses update data'))
        
    } catch (error) {
        console.error(error)
        return res.status(500).json(response.error(500,'Internal Server Error'))
    }
}
const verifyOrder = async (req,res) => {
    try {
        const {is_done : isDone} = req.body;
        if (isDone < 0 || isDone > 1 ) {
            return res.status(400).json(response.error(500,'is_done harus bernilai 0 atau 1'))
        }
        if (req.params.order_id !== undefined && isNaN(req.params.order_id)) {
            // order_id tidak boleh string / harus integer
            return res.status(400).json(response.error(400,'order id tidak boleh string'))
        }
        const {order_id : orderId} = req.params;
        const {id : userId} = req.user;
        const findOrder = await Order.findOne({
            where : {
                id : orderId
            }
        })
        if (!findOrder) {
            // Cek apakah order dengan id x ditemukan
            return res.status(404).json(response.error(404,'order not found'))
        }
        if (findOrder.seller_id !== userId) {
            // Cek apakah order yang masuk dengan id x adalah milik user yang login sebagai penjual
            return res.status(401).json(response.error(401,'you dont have access'))
        }
        if (findOrder.is_done !== null) {
            // Cek apakah order sudah selesai transaksi atau belum
            return res.status(401).json(response.error(401,'order sudah selesai,anda tidak bisa merubahnya lagi'))
        }
        if (findOrder.status === null) {
            // Cek apakah order sudah selesai transaksi atau belum
            return res.status(401).json(response.error(401,'order belum di proses oleh seller,anda tidak bisa merubah status final'))
        }
        const options = {
            where : {
                id : orderId
            }
        }
        let dataToBeUpdated = {
            is_done : isDone
        }
        if (isDone === 0) {
            // Kalau statusnya dibatalkan oleh penjual maka transaksi seleseai
            // dengan status 0 atau dibatalkan
            dataToBeUpdated.status = 0
            await Order.update(dataToBeUpdated,options)
            return res.status(200).json(response.success(200,'sukses update data'));

        } 
        await Order.update(dataToBeUpdated,options)
        const dataProductToBeUpdated = {
            status : false,
            isActive : false,
        }
        // merubah product yang terjual ke  status nya tidak aktif dan terjaul
        await Product.update(dataProductToBeUpdated,{
            where : {
                id : findOrder.product_id
            }
        })
        // update order dengan product yang sama yang is_done masih null
        const updateValues = {
            status : 0,
            is_done : 0
        }
        const updateOptions = {
            where : {
                is_done : null,
                product_id : findOrder.product_id,
                seller_id : userId,
                // buyer_id : {
                //     [Op.not] : findOrder.buyer_id
                // }
            }
        }
        await Order.update(updateValues,updateOptions)
        return res.status(200).json(response.success(200,'sukses update data'));
    } catch (error) {
        console.error(error);
        return res.status(500).json(response.error(500,'Internal Server Error'))
    }
   
}
module.exports = {
    getAllOrder,
    getByIdOrder,
    updateOrder,
    verifyOrder
}