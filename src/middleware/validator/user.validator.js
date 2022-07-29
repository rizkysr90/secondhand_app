const { body, param, query } = require('express-validator');

const create = () => {
    return [
        body('email','email wajib diisi').notEmpty(),
        body('password','password wajib diisi').notEmpty(),
        body('name','nama wajib diisi').notEmpty(),
        body('email','email tidak valid').isEmail(),
        body('password','minimal panjang password adalah 8 karakter').isLength({
            min : 8
        }),
        body('password','password tidak boleh mengandung spasi').not().contains(" ")
    ]
}
const login = () => {
    return [
        body('email','email wajib diisi').notEmpty(),
        body('password','password wajib diisi').notEmpty(),
        body('email','email tidak valid').isEmail()
    ]
}
const update = () => {
    return [
        body('name','nama wajib diisi').notEmpty(),
        body('city_id','kota wajib diisi').notEmpty(),
        body('phone_number','no hp wajib diisi').notEmpty(),
        body('address','alamat wajib diisi').notEmpty(),
        body('phone_number','nomor hp tidak valid').isMobilePhone(['id-ID']),
        body('city_id','city_id harus integer').isInt(),
    ]
}

module.exports = {
    create,
    login,
    update
}