const { body, param, query} = require('express-validator')

const create = () => {
    return [
        body('name','Nama Wajib Diisi').notEmpty(),
        body('name','Nama Wajib Diisi').replace(/^\s+|\s+$/g, ""),
        body('price','Harga Produk Wajib Diisi').notEmpty().toInt(),
        body('description','Deskripsi Wajib Diisi').notEmpty(),
        body('isActive', 'Status Diterbitkan Wajib Diisi').notEmpty().toBoolean(),
        body('status', 'Status Terjual Wajib Diisi').notEmpty().toBoolean(),
        body('id_user', 'Id User Harus Di Isi').notEmpty().toInt(),
        body('id_category', 'Id Category Harus Di Isi').notEmpty().toInt()
    ]
}

const update = () => {
    return [
        body('name','Nama Wajib Diisi').notEmpty().replace(`/^\s+|\s+$/g, ""`),
        body('price','Harga Produk Wajib Diisi').notEmpty().toInt(),
        body('description','Deskripsi Wajib Diisi').notEmpty(),
        body('isActive', 'Status Diterbitkan Wajib Diisi').notEmpty().toInt(),
        body('status', 'Status Terjual Wajib Diisi').notEmpty().toInt(),
        body('id_user', 'Id User Harus Di Isi').notEmpty().toInt(),
        body('id_category', 'Id Category Harus Di Isi').notEmpty().toInt()
    ]
}
const getById = () => {
    return [
        param('id','product id harus integer').isInt()
    ]
}


module.exports = {
    create,
    update,
    getById
}