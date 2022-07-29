const response = require('../../utility/responseModel');

const sanitationDataMyProduct = async (req, res, next) => {
        // untuk menangkap attribute yang dimasukan user
        let {name, description} = req.body
    
        // jika name di isi maka akan maksuk ke fungsi
        if (name) {
            // menghapus spasi di depan, di belakang maupun hanya memasukan spasi saja
            req.body.name = name.replace(/^\s+|\s+$/g, "");
        }
           
        if(description){
            // menghapus spasi di depan, di belakang maupun hanya memasukan spasi saja
            req.body.description = description.replace(/^\s+|\s+$/g, "");
        }
        next()
}

module.exports = {
    sanitationDataMyProduct
}