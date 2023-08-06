const {
    ObjectId
  } = require('mongoose').Types;
  
  
  const User = require("../models/user.model")
  
  exports.getUser = async (idOrEmail, fieldName = '_id') => {
    const data = await User.findOne({
      [fieldName]: `${idOrEmail}`
    }).lean();
    return data;
  };

  
  exports.deleteUser = async userId => {
    try {
      const deleteData = await User.findByIdAndDelete(userId)
      return deleteData
    } catch (err) {
      throw err
    }
  }
  
  exports.userVerifyToken = async (userId, emailVerificationToken) => {
    try {
      const {
        nModified
      } = await User.update({
        _id: userId,
        tempTokens: emailVerificationToken
      }, {
        $set: {
          verify_token: true,
          tempTokens: ''
        }
      }, {
        runValidators: true
      })
  
      return nModified
    } catch (err) {
      throw err
    }
  }
  
  exports.userVerifyEmail = async (userId, emailVerificationToken, email) => {
    try {
      const {
        nModified
      } = await User.update({
        _id: userId,
        tempTokens: emailVerificationToken
      }, {
        $set: {
          is_email_changed: false,
          email: email,
          tempTokens: ''
        }
      }, {
        runValidators: true
      })
  
      return nModified
    } catch (err) {
      throw err
    }
  }
  
  
  
  exports.updateUser = async (conditionData, updateData) => {
    try {
      const {
        nModified
      } = await User.update(
        conditionData, {
          $set: updateData
        }, {
          runValidators: true
        }
      )
  
      return nModified
    } catch (err) {
      throw err
    }
  }
  
  
  exports.updateUserById = async (userId, updateData) => {
    try {
      const {
        nModified
      } = await User.findByIdAndUpdate(
        userId, {
          $set: updateData
        }, {
          runValidators: true
        }
      )
  
      return nModified
    } catch (err) {
      throw err
    }
  }