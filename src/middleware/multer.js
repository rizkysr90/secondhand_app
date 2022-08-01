const multer = require('multer');
const response = require('./../utility/responseModel');
const fs = require('fs');
const {CustomError} = require('./../utility/responseModel')

const storage = multer.diskStorage({
    // storage system
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
    const makeResponseObj = {
        location : err.field
    }
    // Mendapatkan Error multer dari filed MulterError
    try {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                throw new CustomError(400,'maximum file size only 2mb');
            }
            if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                throw new CustomError(400,'format file only accept jpg,png,and jpeg')
            } else {
                throw new CustomError(400,err.code);
            }
        } else if (err) {
            throw new CustomError();
        }
        next()
    } catch (err) {
        next(err)
    }
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
