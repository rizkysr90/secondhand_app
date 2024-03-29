const { body, param, query } = require("express-validator");

const resendEmail = () => {
  return [
    body("email", "email does'nt meet the requirement").notEmpty().isEmail(),
    body("username", "username can't be empty").notEmpty(),
    body("username", "username does'nt meet the requirement")
      .not()
      .contains(" ")
      .bail()
      .isLowercase()
      .bail()
      .isAlphanumeric(),
  ];
};
const create = (req, res, next) => {
  const stringField = ["email", "username", "confirm_password", "password"];

  return [
    body("email")
      .notEmpty()
      .withMessage("email cannot be empty")
      .bail()
      .isEmail()
      .withMessage("invalid email format"),
    body("username")
      .notEmpty()
      .withMessage("username cannot be empty")
      .bail()
      .isAlphanumeric()
      .withMessage("username should only contains alphanumeric")
      .bail()
      .isLength({
        min: 6,
        max: 16,
      })
      .withMessage("username should be minimum 6 and maximum 16 character"),
    body("password")
      .notEmpty()
      .withMessage("password cannot be empty")
      .bail()
      .isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage(
        "password must be minimal 1 uppercase,1 lowercase,1 simbol,1 number, and minimum length is 8 char"
      ),
    body("confirm_password")
      .notEmpty()
      .withMessage("confirmation password cannot be empty")
      .bail(),
  ];
};
const login = () => {
  let listValidators = [
    body(["identity", "password"], "identity should be string").isString(),
    body("identity", "identity can't be empty").notEmpty(),
    body("password", "password can't be empty ").notEmpty(),
  ];
  return listValidators;
};
const update = () => {
  return [
    body("name", "name cannot be empty string").notEmpty(),
    body("city_id", "city_id cannot be empty").notEmpty(),
    body("address", "address cannot be empty string").notEmpty(),
    // body('phone_number','nomor hp tidak valid').isMobilePhone(['id-ID']),
    body("city_id", "city_id must be an integer").isInt(),
  ];
};
const confirm_email = () => {
  return [param("emailToken").isJWT()];
};
module.exports = {
  create,
  login,
  update,
  confirm_email,
  resendEmail,
};
