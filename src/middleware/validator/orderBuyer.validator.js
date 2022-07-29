const { body, param, query} = require('express-validator')

module.exports = {
    create() {
        return [
            body(['seller_id','buyer_id','product_id','price']
            ,'seller_id,buyer_id,product_id,price wajib diisi')
            .notEmpty(),
            body(['seller_id','buyer_id','product_id','price']
            ,'seller_id,buyer_id,product_id,price wajib integer')
            .isInt()
        ]
    },
    getAll() {
        return [
            query(['page','row'],'page harus integer').isInt()
        ]
    },
    getById() {
        return [
            param('order_id','parameter order_id harus integer').isInt()
        ]
    }
}