const { body, param, query } = require('express-validator');
const getAll = () => {
    return [
        query(['status','done','page','row']).toInt()
    ]
}
const update = () => {
    return [
        param('order_id').toInt(),
        body('status').toInt()
    ]
}
const getById = () => {
    return [
        param('order_id').toInt()
    ]
}
const verifyOrder = () => {
    return [
        param('order_id').toInt(),
        body('is_done').toInt()
    ]
}

module.exports = {
    getAll,
    update,
    getById,
    verifyOrder
}
