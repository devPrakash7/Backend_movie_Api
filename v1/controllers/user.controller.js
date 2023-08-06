const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const dateFormat = require('../../helper/dateformat.helper');
const User = require('../../models/user.model')

const {
    isValid
} = require('../../services/blackListMail')

const sendVerificationEmail = require('../../services/email.service');
const constants = require('../../config/constants')
const {
    JWT_SECRET
} = require('../../keys/keys');
const {getUser , updateUser} = require('../services')
const keys = require('../../keys/development.keys')

exports.signUp = async (req, res, next) => {

    try {
        const reqBody = req.body

        const checkMail = await isValid(reqBody.email)

        if (checkMail == false) return res.status(constants.WEB_STATUS_CODE.BAD_REQUEST).send({status:constants.STATUS_CODE.FAIL , message:"Please enter a valid email, we don't allow dummy emails."})

        reqBody.password = await bcrypt.hash(reqBody.password, 10);
        reqBody.created_at = await dateFormat.set_current_timestamp();
        reqBody.updated_at = await dateFormat.set_current_timestamp();
        reqBody.AuthTokens = await jwt.sign({
            data: reqBody.email
        }, JWT_SECRET, {
            expiresIn: "24h"
        })
       
        await sendVerificationEmail(reqBody.email);
        const user = await User.create(reqBody)

        user.refresh_tokens = undefined;

        return res.status(constants.WEB_STATUS_CODE.CREATED).send({status:constants.STATUS_CODE.SUCCESS , message:"USER SIGNUP SUCESSFULLLY",user})
       
    } catch (err) {
        console.log("err........", err)
        return res.status(constants.WEB_STATUS_CODE.SERVER_ERROR).send({status:constants.STATUS_CODE.FAIL , message:"Something went wrong. Please try again later."})
    }
}

exports.logout = async (req, res, next) => {

    try {

        const userId = req.user._id
        let UserData = await User.findById(userId)
        
        UserData.AuthTokens = null
        UserData.refresh_tokens = null

        await UserData.save()
        return res.status(constants.WEB_STATUS_CODE.OK).send({status:constants.STATUS_CODE.SUCCESS , message:"USER LOGOUT SUCESSFULLLY"})

    } catch (err) {
        console.log(err)
        return res.status(constants.WEB_STATUS_CODE.SERVER_ERROR).send({status:constants.STATUS_CODE.FAIL , message:"Something went wrong. Please try again later."})
    }
}

exports.login = async (req, res, next) => {

    try {

        const reqBody = req.body
        const { email } = reqBody;

        let user = await User.findOne({ email})
       
        if(user.user_type == 1) 
        return res.status(constants.WEB_STATUS_CODE.BAD_REQUEST).send({status:constants.STATUS_CODE.FAIL , message:"user type must be 2"})
    
        let newToken = await user.generateAuthToken();
        let refreshToken = await user.generateRefreshToken()

        user.AuthTokens = newToken;

        await user.save()
        user.AuthTokens =  undefined;
        user.refresh_tokens = undefined;

      return res.status(constants.WEB_STATUS_CODE.OK).send({status:constants.STATUS_CODE.SUCCESS , message:"USER LOGIN SUCESSFULLLY" , user})

    } catch (err) {
        console.log('err.....', err)
        return res.status(constants.WEB_STATUS_CODE.SERVER_ERROR).send({status:constants.STATUS_CODE.FAIL , message:"Something went wrong. Please try again later."})
    }
}


exports.resetPassword = async (req, res, next) => {

    try {

        const reqBody = req.body

        if (reqBody.new_password !== reqBody.confirm_password) {

            message = req.flash(
                'error',
                'New password and confirm password not matched.'
            );

            return res.redirect(
                Keys.BASEURL + 'v1/web/reset-password?token=' + reqBody.reset_password_token
            );
        }


        let userDetails = await getUser(reqBody.reset_password_token, "reset_password_token");

        if (!userDetails) {
            message = req.flash(
                'error',
                'Your account verify link expire or invalid.'
            );

            return res.render('message', {
                req: req,
                logoUrl: Keys.BASEURL + `images/logo/logo.png`,
                appBaseUrl: Keys.BASEURL,
                constants: constants,
                message: 'message',
                error: req.flash('error'),
                success: req.flash('success'),
            });
        }

        userDetails.password = await bcrypt.hash(reqBody.new_password, 10);
        userDetails.updated_at = await dateFormat.set_current_timestamp();
        userDetails.reset_password_token = null

        const changePassword = updateUser({
            reset_password_token: reqBody.reset_password_token
        }, userDetails)

        // sendResponse(res, constants.WEB_STATUS_CODE.OK, constants.STATUS_CODE.SUCCESS, 'USER.passwordUpdate_success', changePassword, req.headers.lang);

        message = req.flash(
            'success',
            'Your password successfully changed.'
        );

        return res.render('message', {
            req: req,
            logoUrl: Keys.BASEURL + `images/logo/logo.png`,
            appBaseUrl: Keys.BASEURL,
            constants: constants,
            message: 'message',
            error: req.flash('error'),
            success: req.flash('success'),
        });
       
        return res.status(constants.WEB_STATUS_CODE.OK).send({status:constants.STATUS_CODE.SUCCESS , message:"USER SUCESSFULLLY RESET PASSWORD"})

    } catch (err) {
        console.log(err)
        return res.status(constants.WEB_STATUS_CODE.SERVER_ERROR).send({status:constants.STATUS_CODE.FAIL , message:"Something went wrong. Please try again later."})
    }
}


