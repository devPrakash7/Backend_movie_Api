const express = require('express');
const router = express.Router();
const authenticate = require('../../middleware/authenticate');
const { user_validator,
  login_validator,
  restPassword_validator,result
 } = require('../../validation/user.validation')


const {
  signUp,
  login,
  resetPassword,
  logout,
} = require('../controllers/user.controller')


router.post('/signUp', user_validator,result, signUp)
router.post('/login',login_validator, result, login)
router.get("/logout" ,authenticate, logout)
router.post('/reset-password', restPassword_validator,result,authenticate, resetPassword)



module.exports = router;
