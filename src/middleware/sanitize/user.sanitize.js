const { body, param, query } = require('express-validator');
const create = () => {
    return [
        body('name').trim()
    ]
}
const update = () => {
    return [
        body('name').trim(),
        body('city_id').toInt()
    ]
}

module.exports = {
    create,
    update
}
