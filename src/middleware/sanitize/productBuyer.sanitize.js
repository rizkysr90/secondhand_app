const { body, param, query } = require('express-validator');
const onProcess = () => {
    return [
        param('product_id').toInt()
    ]
}


module.exports = {
    onProcess,
}
