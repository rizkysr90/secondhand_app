const { body, param, query } = require('express-validator');
const create = () => {
    return [
        body(['email','password','confirm_password','name']).trim()
    ]
}
const update = () => {
    return [
        param('user_id').toInt(),
        body('name').trim(),
        body('city_id').toInt()
    ]
}

module.exports = {
    create,
    update
}
