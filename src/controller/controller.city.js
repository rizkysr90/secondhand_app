const {City} = require('./../models/');
const response = require('./../utility/responseModel');
const pagination = require('./../utility/pagination');
const { Op } = require('sequelize');

const getAllDataCities = async (req,res) => {
    try {
        // Membuat fitur pagination dengan data yang diambil dari url query dengan nama page
        // fungsi pagination mengembalikan,data page dan row yang akan digunakan untuk pengambilan di db
        // req.query.page adalah data yang diberikan di url untuk menentukan offset database
        const {page,row} = pagination(req.query.page,req.query.row)
        const options = {
            where : {

            },
            attributes : {
                exclude : ['createdAt','updatedAt']
            },
            // Jadi kita akan mengambil row data sebanyak row yang sudah diberikan oleh pagination fungsi (row)
            limit : row,
            // Jadi kita akan mengambil row data dengan offset yang sudah diberikan oleh pagination fungsi (page)
            offset : page,
            // Jadi kita mengurutkan pengambilan data dari huruf A ke Z
            order : [['name','ASC']]
        }
        if (req.query.name) {
            options.where.name =  {
                [Op.iLike]: `%${req.query.name}%`
            }
        }
        const dataCities = await City.findAll(options)
       
        return res.status(200).json(response.success(200,dataCities));
    } catch (error) {
        console.error(error);
        return res.status(500).json(response.error(500,'Internal Server Error'));
    }
  

}



module.exports = {
    getAllDataCities,

}