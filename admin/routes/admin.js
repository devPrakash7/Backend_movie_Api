const express = require('express');
const router = express.Router();
const {login_validator , result} = require('../../validation/user.validation')

const { login } = require('../controllers/admin.controller')

router.post('/login', login_validator, result, login)


module.exports = router;


