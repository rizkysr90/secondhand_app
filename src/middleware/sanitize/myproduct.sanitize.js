const { body, param, query } = require('express-validator');
module.exports = {
    getById() {
        return [
            param('id').toInt()
        ]
    }
}