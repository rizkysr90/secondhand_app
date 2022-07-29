const multer = require('multer');
const response = require('./../utility/responseModel');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const fileLocation = 'public/static/images';
        if (!fs.existsSync(fileLocation)) fs.mkdirSync(fileLocation, { recursive: true });
        cb(null, fileLocation);
    },
    filename: (req, file, cb) => {
        const fileType = file.mimetype.split('/')[1];
        cb(null, + Date.now() + '-' + file.fieldname + `.${fileType}`);
    },
});

const MulterError = (err, req, res, next) => {
    console.log(err);
    const makeResponseObj = {
        location : err.field
    }
    // Mendapatkan Error multer dari filed MulterError
    console.log('MASOKKKKK')
    if (err instanceof multer.MulterError) {
        console.log('inside multer limit file size')
        if (err.code === 'LIMIT_FILE_SIZE') {
            makeResponseObj.message = 'file terlalu besar,maksimal 2mb';
            return res.status(400).json(response.error(400,makeResponseObj));
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        console.log('inside multer unexpected file')
            makeResponseObj.message = 'Format Gambar Hanya bisa Jpg, Png, jpeg';
            return res.status(400).json(response.error(400,makeResponseObj));
        } else {
            return res.status(400).json(response.error(400,err.code));
        }
    } else if (err) {
        return res.status(500).json(response.error(500,'Internal Server Error'))
    }
    next()
}
const fileFilterImage = (req,file,cb) => {
    // Tipe file yang valid
        const validType = ['image/jpg','image/png','image/jpeg'];
        // Cek,apakah tipe file yang diupload sesuai
        if (!validType.includes(file.mimetype)) {
            // Return agar tidak melanjutkan fungsinya
            cb(null,false);
            return cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE'))
        } else {
            cb(null,true);
        }

    
} 
const upload = multer({
    storage: storage,
    fileFilter:fileFilterImage,
    limits: {
        fileSize: 2000000
    }
   
})

  


module.exports = {
    upload,
    MulterError
}
