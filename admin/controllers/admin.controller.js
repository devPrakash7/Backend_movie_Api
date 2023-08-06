const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dateFormat = require('../../helper/dateformat.helper');
const constants = require('../../config/constants');
const User = require('../../models/user.model');


exports.login = async (req, res, next) => {

    try {

        const reqBody = req.body
        const {email} = reqBody;

        let user = await User.findOne({ email})
       
        if(user.user_type == 2) 
        return res.status(constants.WEB_STATUS_CODE.BAD_REQUEST).send({status:constants.STATUS_CODE.FAIL , message:"user type must be 1"})
    
        let newToken = await user.generateAuthToken();
        let refreshToken = await user.generateRefreshToken()
        user.AuthTokens = newToken;
        user.refresh_tokens = refreshToken;

        await user.save()
        
        user.refresh_tokens = undefined;

      return res.status(constants.WEB_STATUS_CODE.OK).send({status:constants.STATUS_CODE.SUCCESS , message:"USER LOGIN SUCESSFULLLY" , user})

    } catch (err) {
        console.log('err.....', err)
        return res.status(constants.WEB_STATUS_CODE.SERVER_ERROR).send({status:constants.STATUS_CODE.FAIL , message:"Something went wrong. Please try again later."})
    }
}
