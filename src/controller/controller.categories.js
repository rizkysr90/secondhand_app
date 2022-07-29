const { Category } = require('../models');
const response = require('../utility/responseModel');
const fs = require('fs');
const cloudinary = require('../utility/cloudinary');
const pagination = require('./../utility/pagination');
const uploader = async (path,opts) => await cloudinary.uploadCloudinary(path,opts);
const deleteAtCld = async (path,opts) => await cloudinary.deleteCloudinary(path);

const getAllCategory = async (req, res) => {
  try {
    const { page, row } = pagination(req.query.page, req.query.row);
    const options = {
      order: [['name', 'ASC']],
      attributes: ['id', 'name', 'image', 'isActive'],
      limit: row,
      offset: page,
    };

    const getAllCategory = await Category.findAll(options);

    if (!getAllCategory) {
      return res
        .status(404)
        .json(response.error(404, 'Category not found'));
    }
    return res.status(200).json(response.success(200, getAllCategory));
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json(response.error(500, 'Internal Server Error'));
  }
};

const getCategoryById = async (req, res) => {
  try {
    const id_category = req.params.id;

    const optionsNotId = {
      where: {
        id: id_category,
      },
    };

    const idnull = await Category.findOne(optionsNotId);

    if (idnull === null) {
      return res
        .status(401)
        .json(
          response.error(
            401,
            `Category dengan ID ${id_category} Tidak Ditemukan`
          )
        );
    }

    const options = {
      where: {
        id: id_category,
      },
      attributes: ['id', 'name', 'image', 'isActive'],
    };

    const getCategoryById = await Category.findOne(options);

    if (!getCategoryById) {
      return res.status(404).json(response.error(404, 'Category not found'));
    }

    return res.status(200).json(response.success(200, getCategoryById));
  } catch (err) {
    console.log(err);

    return res
      .status(500)
      .json(response.error(500, 'Internal Server Error'));
  }
};

const createCategory = async (req, res) => {
  try {

    // Data yang dibutuhkan untuk membuat category untuk sekarang hanya :
    // isActive,name,image
    const { name, isActive } = req.body;

    const dataMyCategoryInsertDatabase = {
      name: name,
      isActive: isActive,
    };
    
    // upload image yang sudah dioptimasi ke cld
    // referensi docs -> https://cloudinary.com/documentation/image_upload_api_reference#upload_examples
    const optionsCloudinary = {
      type: "image",
      folder: "secondhand_app/image/categories"
    }
    const uploadImageResponse = await uploader(req.file.path,optionsCloudinary);
    
    // Mendestructuring publicId sebagai profile_picture_id,dan url hasil optimisasi gambar
    const {public_id,eager} = uploadImageResponse;
    // eager is the result of optimization image
    const secure_url = eager[0].secure_url;
    dataMyCategoryInsertDatabase.image = secure_url;
    dataMyCategoryInsertDatabase.image_public_id = public_id;
    // Menghapus data gambar yg diupload oleh multer jika terjadi error
    fs.unlinkSync(req.file.path);
    const createCategory = await Category.create(
      dataMyCategoryInsertDatabase
    );
   

    
    return res
      .status(201)
      .json(response.success(201, 'Succes add data'));
  } catch (err) {
    // Menghapus data gambar yg diupload oleh multer jika terjadi error
    fs.unlinkSync(req.file.path);
    console.log(err);
    return res
      .status(500)
      .json(response.error(500, 'Internal Server Error'));
  }
};

const updateCategory = async (req, res) => {
  try {
    const id_category = req.params.id;
    // Cek apakah kategori dengan id_category ada didatabase
    const findCategory = await Category.findOne({
      where : {
        id : id_category
      }
    })
    if (!findCategory) {
      return res.status(404).json(response.error(404,'Category not found'))
    }
    const { name, isActive} = req.body;

    const dataCategory = {
      name: name,
      isActive: isActive,
    };

    if (req.file === undefined) {
      await Category.update(dataCategory, {
        where: {
          id: id_category,
        },
      });
      res.status(200).json(response.success(200, "Sukses update data"));
    } else {
      const optionsCloudinary = {
        type: "image",
        folder: "secondhand_app/image/categories"
      }
      const uploadImageResponse = await uploader(req.file.path,optionsCloudinary);
      // Mendestructuring publicId sebagai profile_picture_id,dan url hasil optimisasi gambar
      const {public_id,eager} = uploadImageResponse;
      // eager is the result of optimization image
      const secure_url = eager[0].secure_url;
      dataCategory.image = secure_url;
      dataCategory.image_public_id = public_id;
      // Menghapus data gambar yg diupload oleh multer jika terjadi error
      fs.unlinkSync(req.file.path);
      await Category.update(dataCategory, {
        where: {
          id: id_category,
        },
      });
      if (findCategory.image_public_id !== null) {
        // Delete previous image in cloudinary
          await deleteAtCld(findCategory.image_public_id);
      }
      res.status(201).json(response.success(201, "Sukses update data"));
    }
    

  } catch (err) {
     // Menghapus data gambar yg diupload oleh multer jika terjadi error
     fs.unlinkSync(req.file.path);
    console.log(err);
    return res
      .status(500)
      .json(response.error(500, 'Internal Server Error'));
  }
};

const deleteCategoryById = async (req, res) => {
  try {
    const id_category = req.params.id;

    const optionsNotId = {
      where: {
        id: id_category,
      },
    };
    const idnull = await Category.findOne(optionsNotId);

    if (idnull === null) {
      return res
        .status(404)
        .json(
          response.error(
            404,
            `id_category ${id_category} Tidak Ditemukan`
          )
        );
    }
   

    const options = {
      where: {
        id: [id_category],
      },
    };

    const deleteCategory = await Category.destroy(options);

    if (deleteCategory === 0) {
      return res
        .status(404)
        .json(
          response.error(
            404,
            `Data Category dengan id ${id_category} Gagal Dihapus`
          )
        );
    }
    if (idnull.image_public_id !== null) {
      // Delete previous image in cloudinary
        await deleteAtCld(idnull.image_public_id);
    }

    return res
      .status(200)
      .json(
        response.success(
          200,
          `Data Category dengan id ${id_category} Berhasil Dihapus`
        )
      );
  } catch (err) {
    console.log(err);

    return res
      .status(500)
      .json(response.error(500, 'Internal Server Error'));
  }
};

module.exports = {
  getAllCategory,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategoryById,
};
