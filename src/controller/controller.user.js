const { User, City } = require("./../models/");
const fs = require("fs");
const response = require("./../utility/responseModel");
const { CustomError } = require("./../utility/responseModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("../utility/bcrypt");
const issueJWT = require("../utility/issueJwt");
const {
  sendEmailSMTP,
  generateTemplateEmail,
} = require("../utility/nodemailer");
const cloudinary = require("../utility/cloudinary");
const { Op } = require("sequelize");
const uploader = async (path, opts) =>
  await cloudinary.uploadCloudinary(path, opts);
const deleteAtCld = async (path, opts) =>
  await cloudinary.deleteCloudinary(path);

const createUser = async (req, res, next) => {
  // Pakai try catch untuk handle error by server agar bisa ditangkap
  try {
    const { username, email, password, confirm_password } = req.body;
    if (confirm_password !== password) {
      throw new CustomError(400, "confirmation password is incorrect");
    }
    // //  Regex only alphabet and spaces
    // let patternAlphaAndSpaceOnly = /^[a-zA-Z ]*$/;
    // if (!patternAlphaAndSpaceOnly.test(name)) {
    //     throw new CustomError(400,'name is not allowed to contains number and symbol')
    // }
    // Email dan username harus unique,jadi sebelum create data melakukan validasi
    // dengan cara findOne dengan menggunakan email dan username
    const findUserByEmail = await User.findOne({
      where: {
        email,
      },
    });
    // Jika ditemukan/true maka kembalikan response error dan jika false maka bisa membuat user
    if (findUserByEmail) {
      // response.error merupakan utility yang dibuat di folder utility/responseModel.js
      // Saat mau mengembalikan response dari request wajib melakukan return agar server tidak error
      throw new CustomError(400, "email has already been registered");
    }
    const findUserByUsername = await User.findOne({
      where: {
        username,
      },
    });
    // Jika ditemukan/true maka kembalikan response error dan jika false maka bisa membuat user
    if (findUserByUsername) {
      // response.error merupakan utility yang dibuat di folder utility/responseModel.js
      // Saat mau mengembalikan response dari request wajib melakukan return agar server tidak error
      throw new CustomError(400, "username has already been used");
    }
    // Sebelum create user di database,password harus di enkripsi terlebih dahulu
    const hashedPassword = await bcrypt.hash(password);
    // Buat data yang akan dimasukkan ke database,karna untuk data profile secara default harus null
    // jadi untuk menambahkan data profile bisa melakukan update user saja
    const userData = {
      email: email,
      password: hashedPassword,
      username: username,
    };
    // Membuat user ke database
    const createUser = await User.create(userData);
    // Send email confirmation after success to create new user
    // jwt.sign(
    //   {
    //     user: createUser.id,
    //   },
    //   process.env.EMAIL_SECRET,
    //   {
    //     expiresIn: "1d",
    //   },
    //   async (err, emailToken) => {
    //     if (err) {
    //       next(err);
    //     }
    //     const url = `http://localhost:3000${process.env.BASE_URL}${process.env.URL_ROUTER_REGISTER}/confirmation/${emailToken}`;
    //     const emailTemplate = await generateTemplateEmail({
    //       type: "new_account",
    //       username: username,
    //       confirm_email: url,
    //     });
    //     sendEmailSMTP({
    //       receiver: email,
    //       subject: "Secondhand - Email Verification",
    //       text: `Hi ${username},welcome to Secondhand`,
    //       html: emailTemplate,
    //     });
    //   }
    // );
    // Jika berhasil,buat data untuk diberikan pada response
    // data yang credential seperti password,email,address tidak usah dikirim di response
    // kecuali jika dibutuhkan
    const responseBody = {
      username: createUser.username,
    };
    // Saat mau mengembalikan response dari request wajib melakukan return agar server tidak error
    res.status(201).json(response.success(201, responseBody));
  } catch (err) {
    next(err);
  }
};
const confirm_email = async (req, res, next) => {
  try {
    const { emailToken } = req.params;
    let userId;
    jwt.verify(emailToken, process.env.EMAIL_SECRET, function (err, decoded) {
      if (err) {
        res.redirect(`http://localhost:3000${process.env.BASE_URL}/invalid`);
      } else {
        userId = decoded.user;
      }
    });
    const userFindById = await User.findByPk(userId);
    if (userFindById.confirm_email) {
      res.redirect(
        `http://localhost:3000${process.env.BASE_URL}/emailconfirmed`
      );
    }
    await User.update({ confirm_email: true }, { where: { id: userId } });
    res.redirect(`http://localhost:3000${process.env.BASE_URL}/emailconfirmed`);
  } catch (error) {
    next(error);
  }
};
const login = async (req, res, next) => {
  try {
    // Di request body ada data email dan password
    const { identity, password } = req.body;
    const findUniqueUserOpts = {};

    if (identity.indexOf("@") === -1) {
      // identity should be username
      findUniqueUserOpts.where = {
        username: identity,
      };
    } else {
      findUniqueUserOpts.where = {
        email: identity,
      };
    }
    // Mencari user dengan email/username yang diberikan oleh user
    const findUser = await User.findOne(findUniqueUserOpts);
    if (!findUser) {
      // Kalau pencarian user tidak ketemu,maka akan merespon dengan 404
      throw new CustomError(404, "user not found");
    }
    if (!findUser.confirm_email) {
      // email belum diverifikasi
      throw new CustomError(403, "email is not verified");
    }
    const verifyPassword = await bcrypt.compare(password, findUser.password);
    if (!verifyPassword) {
      // password salah
      throw new CustomError(400, "password doesn't match");
    }
    // Jika password sesuai,server membuat jwt token untuk authorization
    const jwt = issueJWT(findUser);
    // add jwt for response body and add username user
    jwt.username = findUser.username;
    return res.status(200).json(response.success(200, jwt));
  } catch (err) {
    next(err);
  }
};
const updateProfile = async (req, res, next) => {
  try {
    // untuk mendeklarasikan fungsi yang berada di cloudinary dengan async await
    // console.log(req.params);
    const userAuth = req.user;
    const { username } = req.params;
    // Cek apakah user yang request dengan params user_id sesuai dengan user_id di jwt (req.user.id)
    if (!(username === userAuth.username)) {
      fs.unlinkSync(req.file.path);
      throw CustomError(401, "you dont have an access");
    }
    const userFindByUsername = await User.findOne({ where: { username } });
    if (!userFindByUsername) {
      throw new CustomError(404, "user not found");
    }
    if (!userFindByUsername.confirm_email) {
      // email not verified
      throw new CustomError(403, "email is not verified");
    }
    if (userAuth.username !== username) {
      throw new CustomError(401, "you dont have an access");
    }
    // Cek apakah request mengirimkan sebuah file upload atau tidak
    if (req.file === undefined) {
      // update profile tanpa photo_profile
      let fieldsToUpdate = ["address", "name", "city_id"];
      // Update user dimana id sama dengan user_id
      await User.update(req.body, {
        where: {
          username,
        },
        fields: fieldsToUpdate,
      });
      // Jika berhasil response 200 / succes
      res.status(200).json(response.success(200, "success update data"));
    } else {
      // upload image yang sudah dioptimasi ke cld
      // referensi docs -> https://cloudinary.com/documentation/image_upload_api_reference#upload_examples
      const optionsCloudinary = {
        type: "image",
        folder: "secondhand_app/image/profile_picture",
      };
      const uploadImageResponse = await uploader(
        req.file.path,
        optionsCloudinary
      );

      // Mendestructuring publicId sebagai profile_picture_id,dan url hasil optimisasi gambar
      const { public_id, eager } = uploadImageResponse;
      // eager is the result of optimization image
      const [imageOptimization] = eager;
      const { secure_url } = imageOptimization;
      // Menambahkan profile_picture dan profile_picture_id ke sequelize database values
      req.body.profile_picture = secure_url;
      req.body.profile_picture_id = public_id;
      // Update user
      let fieldsToUpdate = [
        "address",
        "name",
        "city_id",
        "profile_picture",
        "profile_picture_id",
      ];
      await User.update(req.body, {
        where: {
          username,
        },
        fields: fieldsToUpdate,
      });
      // Menghapus foto profile lama setelah diganti dengan yang baru
      // Kita bisa mendapatkan data foto profile lama dari user yang login melewati jwt
      // console.log(dataUserFromJWT)
      // Melakukan penghapusan resource di cld
      if (userAuth.profile_picture_id) {
        await deleteAtCld(dataUserFromJWT.profile_picture_id);
      }
      // Delete file uploaded by multer in ~/public/static/images
      fs.unlinkSync(req.file.path);
      res.status(200).json(response.success(200, "success update data"));
    }
  } catch (error) {
    // Delete file uploaded by multer in ~/public/static/images
    fs.unlinkSync(req.file.path);
    next(error);
  }
};
const getProfileById = async (req, res, next) => {
  try {
    const { username } = req.params;
    const userAuth = req.user;
    if (username !== userAuth.username) {
      throw new CustomError(401, "you dont have an access");
    }
    const options = {
      // Exclude berarti saat mengembalikan response,tidak ada data password dan updatedAt
      attributes: {
        exclude: [
          "password",
          "updatedAt",
          "profile_picture_id",
          "city_id",
          "confirm_email",
          "phone_number",
          "email",
          "username",
          "createdAt",
          "id",
        ],
      },
      where: {
        username,
      },
      include: {
        model: City,
        attributes: { exclude: ["createdAt", "updatedAt", "id"] },
      },
    };
    const findUser = await User.findOne(options);
    if (!findUser) {
      throw new CustomError(404, "user not found");
    }
    res.status(200).json(response.success(200, findUser));
  } catch (err) {
    next(err);
  }
};

const resendEmail = async (req, res, next) => {
  try {
    const { username, email } = req.body;
    const user = await User.findOne({
      where: {
        username,
        email,
      },
    });
    if (!user) {
      throw new CustomError(404, "user not found");
    }
    if (user.confirm_email) {
      throw new CustomError(403, "email was verified");
    }
    // Send email confirmation after success to create new user
    jwt.sign(
      {
        user: user.id,
      },
      process.env.EMAIL_SECRET,
      {
        expiresIn: "1d",
      },
      async (err, emailToken) => {
        if (err) {
          next(err);
        }
        const url = `http://localhost:3000${process.env.BASE_URL}${process.env.URL_ROUTER_REGISTER}/confirmation/${emailToken}`;
        const emailTemplate = await generateTemplateEmail({
          type: "new_account",
          username: username,
          confirm_email: url,
        });
        sendEmailSMTP({
          receiver: email,
          subject: "Secondhand - Email Verification",
          text: `Hi ${username},welcome to Secondhand`,
          html: emailTemplate,
        });
      }
    );
    res.status(200).json(response.success("sukses resend email"));
  } catch (error) {
    next(error);
  }
};
module.exports = {
  resendEmail,
  createUser,
  login,
  updateProfile,
  getProfileById,
  confirm_email,
};
