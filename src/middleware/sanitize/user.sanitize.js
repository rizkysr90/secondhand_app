const { body, param, query } = require('express-validator');
const create = () => {
    return [
        body('email').trim(),
    ]
}
const update = () => {
    return [
        body('city_id').toInt(),
        body(['name','address']).trim(),
        param('username').toLowerCase()
    ]
}

module.exports = {
    create,
    update
}
