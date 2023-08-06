
const dateFormat = require('../../helper/dateformat.helper');
const constants = require('../../config/constants');
const User = require('../../models/user.model');
const Series = require('../../models/series.model')

exports.add_Series = async (req, res, next) => {

    try {

        const reqBody = req.body
        const userId =  req.user._id;

        const { title,genre,releaseYear,director,duration,description,series_poster} = reqBody;

        let user = await User.findOne({ _id: userId})

        if(user.user_type == 2) 
        return res.status(constants.WEB_STATUS_CODE.BAD_REQUEST).send({status:constants.STATUS_CODE.FAIL , message:"Only Admin can be added Series"})
        reqBody.created_at = await dateFormat.set_current_timestamp();
        reqBody.updated_at = await dateFormat.set_current_timestamp();

        let files = req.file;
        reqBody.series_poster = files.originalname;
        const series = await Series.create(reqBody);

      return res.status(constants.WEB_STATUS_CODE.CREATED).send({status:constants.STATUS_CODE.SUCCESS , message:"ADD Series SUCESSFULLLY" , series})

    } catch (err) {
        console.log('err.....', err)
        return res.status(constants.WEB_STATUS_CODE.SERVER_ERROR).send({status:constants.STATUS_CODE.FAIL , message:"Something went wrong. Please try again later."})
    }
}

exports.get_all_Series = async (req, res, next) => {

    try {

      const Series = await Series.find({} , {title:1 ,releaseYear:1,director:1,duration:1,description:1,Series_poster:1})

      return res.status(constants.WEB_STATUS_CODE.OK).send({status:constants.STATUS_CODE.SUCCESS , message:"SUCESSFULLLY GET ALL SeriesS" , Series})

    } catch (err) {
        console.log('err.....', err)
        return res.status(constants.WEB_STATUS_CODE.SERVER_ERROR).send({status:constants.STATUS_CODE.FAIL , message:"Something went wrong. Please try again later."})
    }
}

exports.searching_series = async (req, res, next) => {

    try {

        const { search } = req.query;
        const query = {};
    
        // If the search query exists, perform a search based on title, genre, or cast/crew details
        if (search) {
          query.$or = [
            { title: { $regex: search, $options: 'i' } }, // Case-insensitive search by title
            { genre: { $regex: search, $options: 'i' } }, // Case-insensitive search by genre
            // Add more search criteria for cast/crew details (e.g., director, actors)
          ];
        }
    
        const Series = await Series.find(query);

        return res.status(constants.WEB_STATUS_CODE.OK).send({status:constants.STATUS_CODE.SUCCESS , message:"SUCESSFULLLY GET Series" , Series})
    } catch (err) {
        console.log('err.....', err)
        return res.status(constants.WEB_STATUS_CODE.SERVER_ERROR).send({status:constants.STATUS_CODE.FAIL , message:"Something went wrong. Please try again later."})
    }
}


exports.series_pagination = async (req, res, next) => {

    try {

        const { page = 1, limit = 10, sortBy = 'releaseYear', sortOrder = 'description', search } = req.query;

        // Build the query object for searching
        const query = {};
        if (search) {
          query.$or = [
            { title: { $regex: search, $options: 'i' } }, // Case-insensitive search by title
            { genre: { $regex: search, $options: 'i' } }, // Case-insensitive search by genre
            // Add more search criteria for cast/crew details (e.g., director, actors)
          ];
        }
    
        // Calculate the number of documents to skip based on the current page and limit
        const skip = (parseInt(page) - 1) * parseInt(limit);
    
        // Find all movies based on the search query, sort, and limit the results
        const series = await Series.find(query)
          .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
          .skip(skip)
          .limit(parseInt(limit));
    
        // Get the total count of movies matching the search query (without pagination)
        const totalCount = await Series.countDocuments(query);

        return res.status(constants.WEB_STATUS_CODE.OK).send({status:constants.STATUS_CODE.SUCCESS , message:" SUCESSFULLLY GET series" , data:{ series , totalCount}})
    } catch (err) {
        console.log('err.....', err)
        return res.status(constants.WEB_STATUS_CODE.SERVER_ERROR).send({status:constants.STATUS_CODE.FAIL , message:"Something went wrong. Please try again later."})
    }
}


exports.get_Series_by_id = async (req, res, next) => {

    try {
     
        const { SeriesId } = req.query;
      const Series = await Series.findOne({_id : SeriesId})

      return res.status(constants.WEB_STATUS_CODE.OK).send({status:constants.STATUS_CODE.SUCCESS , message:"SUCESSFULLLY GET SeriesS" , Series})

    } catch (err) {
        console.log('err.....', err)
        return res.status(constants.WEB_STATUS_CODE.SERVER_ERROR).send({status:constants.STATUS_CODE.FAIL , message:"Something went wrong. Please try again later."})
    }
}

exports.series_rating = async (req, res, next) => {

    try {
     
        const trendingSeries = await Series.find().sort({ popularity: -1 }).limit(10);
        return res.status(constants.WEB_STATUS_CODE.OK).send({status:constants.STATUS_CODE.SUCCESS , message:"SUCESSFULLLY GET MOVIES RATING" ,  trendingSeries})

    } catch (err) {
        console.log('err.....', err)
        return res.status(constants.WEB_STATUS_CODE.SERVER_ERROR).send({status:constants.STATUS_CODE.FAIL , message:"Something went wrong. Please try again later."})
    }
}

exports.update_Series = async (req, res, next) => {

    try {
     
        const { SeriesId } = req.query;
        const reqBody = req.body
        const userId =  req.user._id;

        const { title,releaseYear,description } = reqBody;

        let user = await User.findOne({ _id: userId}) 

        if(user.user_type == 2) 
        return res.status(constants.WEB_STATUS_CODE.BAD_REQUEST).send({status:constants.STATUS_CODE.FAIL , message:"Only Admin can be added Series"})
        
        reqBody.updated_at = await dateFormat.set_current_timestamp();
        const Series = await Series.findOneAndUpdate({_id : SeriesId} ,reqBody , {new:true})

       return res.status(constants.WEB_STATUS_CODE.OK).send({status:constants.STATUS_CODE.SUCCESS , message:"Series SUCESSFULLLY UPDATED" , Series})

    } catch (err) {
        console.log('err.....', err)
        return res.status(constants.WEB_STATUS_CODE.SERVER_ERROR).send({status:constants.STATUS_CODE.FAIL , message:"Something went wrong. Please try again later."})
    }
}


exports.delete_Series = async (req, res, next) => {

    try {
     
        const { SeriesId } = req.query;
        const reqBody = req.body
        const userId =  req.user._id;

        const { title,releaseYear,description } = reqBody;

        let user = await User.findOne({ _id: userId}) 

        if(user.user_type == 2) 
        return res.status(constants.WEB_STATUS_CODE.BAD_REQUEST).send({status:constants.STATUS_CODE.FAIL , message:"Only Admin can be added Series"})
        
        reqBody.delete_at = await dateFormat.set_current_timestamp();
        const Series = await Series.findOneAndDelete({_id : SeriesId})

       return res.status(constants.WEB_STATUS_CODE.OK).send({status:constants.STATUS_CODE.SUCCESS , message:"Series SUCESSFULLLY UPDATED" , Series})

    } catch (err) {
        console.log('err.....', err)
        return res.status(constants.WEB_STATUS_CODE.SERVER_ERROR).send({status:constants.STATUS_CODE.FAIL , message:"Something went wrong. Please try again later."})
    }
}



