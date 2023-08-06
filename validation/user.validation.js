
const { body, validationResult } = require('express-validator');


//validate user form detail
const user_validator = [
    body('email')
      .not()
      .isEmpty()
      .withMessage('Email is required')
      .isString()
      .withMessage('Email must be Strings')
      .isEmail().withMessage('Enter valid email')
      .trim(),

    body('password')
      .not()
      .isEmpty()
      .withMessage('password is required')
      .isString()
      .withMessage('password must be a string')
      .trim()
      .isLength({ min: 6 }).withMessage("password length should be 6")
      .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$.!%*#?&])[A-Za-z\d@$.!%*#?&]{8,}$/)
      .withMessage('Enter valid password'),

      body('name')
      .not()
      .isEmpty()
      .withMessage('name is required')
      .isString()
      .withMessage('name must be a string')
      .trim()
      
];

const login_validator = [

 body('email')
      .not()
      .isEmpty()
      .withMessage('Email is required')
      .isString()
      .withMessage('Email must be Strings')
      .isEmail().withMessage('Enter valid email')
      .trim(),

    body('password')
      .not()
      .isEmpty()
      .withMessage('password is required')
      .isString()
      .withMessage('password must be a string')
      .trim()
      .isLength({ min: 6 }).withMessage("password length should be 6")
      .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$.!%*#?&])[A-Za-z\d@$.!%*#?&]{8,}$/)
      .withMessage('Enter valid password'),
];



const restPassword_validator = [

    body('new_password')
    .not()
    .isEmpty()
    .withMessage('new_password is required')
    .trim()
    .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$.!%*#?&])[A-Za-z\d@$.!%*#?&]{8,}$/)
    .withMessage('Enter valid new_password_validation'),
   
    body('confirm_password')
    .not()
    .isEmpty()
    .withMessage('confirm_password is required')
    .trim()
    .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$.!%*#?&])[A-Za-z\d@$.!%*#?&]{8,}$/)
    .withMessage('Enter valid confirm_password'),
   
];


const result = (req, res, next) => {
  const result = validationResult(req);
  const haserror = !result.isEmpty();

  if (haserror) {
    const err = result.array()[0].msg;
    return res.status(400).send({ sucess: false, message: err });
  }

  next();
};


module.exports = {user_validator , login_validator , restPassword_validator , result}