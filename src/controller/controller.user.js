const {User,City} = require('./../models/');
const fs = require('fs');
const response = require('./../utility/responseModel');
const bcrypt = require('../utility/bcrypt');
const issueJWT = require('../utility/issueJwt');
const cloudinary = require('../utility/cloudinary')
const uploader = async (path,opts) => await cloudinary.uploadCloudinary(path,opts);
const deleteAtCld = async (path,opts) => await cloudinary.deleteCloudinary(path);

const dataUserAll = (req,res) => {
    res.status(200).json({
        messege : 'Succcess'
    })
}

const createUser = async (req,res,next) => {
    // Pakai try catch untuk handle error by server agar bisa ditangkap
    try {

        // Di req.body akan ada data = {email,password,name} untuk register
        const {email,password,name} = req.body
        // Email harus unique,jadi sebelum create melakukan validasi
        // dengan cara findOne dengan menggunakan email
        const findUserByEmail = await User.findOne({
            where : {
                email
            }
        })
        // Jika ditemukan/true maka kembalikan response error dan jika false maka bisa membuat user
        if (findUserByEmail) {
            // response.error merupakan utility yang dibuat di folder utility/responseModel.js
            // Saat mau mengembalikan response dari request wajib melakukan return agar server tidak error
            return res.status(400).json(response.error(400,'Email sudah digunakan'));
            
        }
        // Sebelum create user di database,password harus di enkripsi terlebih dahulu
        const hashedPassword = await bcrypt.hash(password);
        // Buat data yang akan dimasukkan ke database,karna untuk data profile secara default harus null
        // jadi untuk menambahkan data profile bisa melakukan update user saja
        const dataToBeInsertToDatabase = {
            email : email,
            password : hashedPassword,
            profile_picture : null,
            phone_number : null,
            address : null,
            city_id : null,
            name : name
        }
        // Membuat user ke database
        const createUser = await User.create(dataToBeInsertToDatabase);
        // Jika berhasil,buat data untuk diberikan pada response
        // data yang credential seperti password,email,address tidak usah dikirim di response
        // kecuali jika dibutuhkan
        const dataToBeSentToResponse = {
            id : createUser.id,
            name : createUser.name
        }
        // Saat mau mengembalikan response dari request wajib melakukan return agar server tidak error
        return res.status(201).json(response.success(201,dataToBeSentToResponse));
    } catch(err) {
        console.log(err);
        // Saat mau mengembalikan response dari request wajib melakukan return agar server tidak error
        return res.status(500).json(response.error(500,'Internal Server Error'));
    }

}
const login = async (req,res) => {
    try {
        // Di request body ada data email dan password
        const {email,password} = req.body;
        // Mencari user dengan email yang diberikan oleh user
        const findUser = await User.findOne({
            where : {
                email
            }
        });
        if (!findUser) {
            // Kalau pencarian user tidak ketemu,maka akan merespon dengan 404
            return res.status(404).json(response.error(404,"User not found"));
        }
        // Jika pencarian ketemu,maka dicompare passwordnya dengan hashnya
        const verifyPassword = await bcrypt.compare(password,findUser.password);
        if (!verifyPassword) {
            return res.status(400).json(response.error(400,"Password tidak sesuai"));
        }
        // Jika password sesuai,server membuat jwt token untuk authorization
        const jwt = issueJWT(findUser);
        // add id to response body
        jwt.id = findUser.id
        return res.status(200).json(response.success(200,jwt));
    } catch (err) {
        console.log(err);
        return res.status(500).json(response.error(500,'Internal Server Error'));
    }
}
const updateProfile = async (req,res) => {
    try {
        // untuk mendeklarasikan fungsi yang berada di cloudinary dengan async await 
        // console.log(req.params);
        const dataUserFromJWT = req.user
        const {user_id} = req.params;
        // Cek apakah user yang request dengan params user_id sesuai dengan user_id di jwt (req.user.id)
        if (!(+user_id === dataUserFromJWT.id)) {
            fs.unlinkSync(req.file.path);
            return res.status(401).json(response.error(401,'Anda tidak memiliki akses'));
        }
        // Cek apakah request mengirimkan sebuah file upload atau tidak
        if (req.file === undefined) {
            // Menghapus sequelize profile_picture field di model User,agar tidak mengupdate
            // profile_picture saat value data dari req.file === undefined / user tidak memasukkan file
            let fieldsToUpdate = ["phone_number","address","name","city_id"];
            // Update user dimana id sama dengan user_id
            await User.update(req.body,{
                where : {
                    id : +user_id
                },
                fields : fieldsToUpdate
            })
            // Jika berhasil response 200 / succes
            return res.status(200).json(response.success(200,"Success update data"));
        } else {
            // upload image yang sudah dioptimasi ke cld
            // referensi docs -> https://cloudinary.com/documentation/image_upload_api_reference#upload_examples
            const optionsCloudinary = {
                type: "image",
                folder: "secondhand_app/image/profile_picture"
            }
            const uploadImageResponse = await uploader(req.file.path,optionsCloudinary);
            
            // const uploadImageResponse = await cloudinary.uploader.upload(req.file.path, {
            //     resource_type: "image",
            //     folder: "secondhand_app/image/profile_picture",
            //     eager_async: true,
            //     eager : {quality: 50}
    
            // });
            // Mendestructuring publicId sebagai profile_picture_id,dan url hasil optimisasi gambar
            const {public_id,eager} = uploadImageResponse;
            // eager is the result of optimization image
            const secure_url = eager[0].secure_url;
            // let fieldsToUpdate = ["profile_picture","public_name","phone_number","address","name","city_id","profile_picture_id"];
            // Menambahkan profile_picture dan profile_picture_id ke sequelize database values
            req.body.profile_picture = secure_url;
            req.body.profile_picture_id = public_id;
            // Update user
            await User.update(req.body,{
                where : {
                    id : +user_id
                }
                
            })
            // Menghapus foto profile lama setelah diganti dengan yang baru
            // Kita bisa mendapatkan data foto profile lama dari user yang login melewati jwt
            // console.log(dataUserFromJWT)
            // Melakukan penghapusan resource di cld
            if (dataUserFromJWT.profile_picture_id) {
                // await cloudinary.uploader.destroy(dataUserFromJWT.profile_picture_id, {
                //     resource_type : "image"
                // });
                await deleteAtCld(dataUserFromJWT.profile_picture_id);
            }
            // Delete file uploaded by multer in ~/public/static/images
            fs.unlinkSync(req.file.path);
            return res.status(200).json(response.success(200,"Success update data"));
        }
    } catch (error) {
        console.log(error);
        // Delete file uploaded by multer in ~/public/static/images
        fs.unlinkSync(req.file.path);
        res.status(500).json(response.error(500,'Internal Server Error'))
    }

}
const getProfileById = async (req,res) => {
    try {
        const {user_id} = req.params;
        // user_id secara default string
        const options = {
            // Exclude berarti saat mengembalikan response,tidak ada data password dan updatedAt
            attributes: {exclude: ['password','updatedAt']},
            where : {
                id : +user_id
            },
            include : {
                model : City,
                attributes: {exclude: ['createdAt','updatedAt']}
            }
        };
        const findUser = await User.findOne(options);
        if (!findUser) {
            return res.status(404).json(response.error(404,"User not found"))
        }
        return res.status(200).json(response.success(200,findUser))
    } catch (err) {
        console.log(err);
        return res.status(500).json(response.error(500,'Internal Server Error'));
    }
   


}


module.exports = {
    dataUserAll,
    createUser,
    login,
    updateProfile,
    getProfileById

}