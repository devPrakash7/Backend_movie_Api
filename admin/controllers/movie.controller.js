
const dateFormat = require('../../helper/dateformat.helper');
const constants = require('../../config/constants');
const User = require('../../models/user.model');
const Movie = require('../../models/movie.model')



exports.add_movie = async (req, res, next) => {

    try {

        const reqBody = req.body
        const userId =  req.user._id;
        console.log(userId)

        const { title,genre,releaseYear,director,duration,description,movie_poster} = reqBody;

        let user = await User.findOne({ _id: userId})

        if(user.user_type == 2) 
        return res.status(constants.WEB_STATUS_CODE.BAD_REQUEST).send({status:constants.STATUS_CODE.FAIL , message:"Only Admin can be added movie"})
        reqBody.created_at = await dateFormat.set_current_timestamp();
        reqBody.updated_at = await dateFormat.set_current_timestamp();
        let files = req.file;
       reqBody.movie_poster = files.originalname;
        const movie = await Movie.create(reqBody);

      return res.status(constants.WEB_STATUS_CODE.CREATED).send({status:constants.STATUS_CODE.SUCCESS , message:"ADD MOVIE SUCESSFULLLY" , movie})

    } catch (err) {
        console.log('err.....', err)
        return res.status(constants.WEB_STATUS_CODE.SERVER_ERROR).send({status:constants.STATUS_CODE.FAIL , message:"Something went wrong. Please try again later."})
    }
}

exports.get_all_movie = async (req, res, next) => {

    try {

      const movie = await Movie.find({} , {title:1 ,releaseYear:1,director:1,duration:1,description:1,movie_poster:1})

      return res.status(constants.WEB_STATUS_CODE.OK).send({status:constants.STATUS_CODE.SUCCESS , message:"SUCESSFULLLY GET ALL MOVIES" , movie})

    } catch (err) {
        console.log('err.....', err)
        return res.status(constants.WEB_STATUS_CODE.SERVER_ERROR).send({status:constants.STATUS_CODE.FAIL , message:"Something went wrong. Please try again later."})
    }
}

exports.searching_movie = async (req, res, next) => {

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
        const movies = await Movie.find(query);

        return res.status(constants.WEB_STATUS_CODE.OK).send({status:constants.STATUS_CODE.SUCCESS , message:"SUCESSFULLLY GET ALL Movie" , movies})
    } catch (err) {
        console.log('err.....', err)
        return res.status(constants.WEB_STATUS_CODE.SERVER_ERROR).send({status:constants.STATUS_CODE.FAIL , message:"Something went wrong. Please try again later."})
    }
}


exports.movie_pagination = async (req, res, next) => {

    try {

        const { page = 1, limit = 10, sortBy = 'releaseYear', sortOrder = 'description', search } = req.query;

        // Build the query object for searching
        const query = {};
        if (search) {
          query.$or = [
            { title: { $regex: search, $options: 'i' } }, // Case-insensitive search by title
            { genre: { $regex: search, $options: 'i' } }, // Case-insensitive search by genre
            
          ];
        }
    
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const movies = await Movie.find(query)
          .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
          .skip(skip)
          .limit(parseInt(limit));
    
        const totalCount = await Movie.countDocuments(query);

        return res.status(constants.WEB_STATUS_CODE.OK).send({status:constants.STATUS_CODE.SUCCESS , message:" SUCESSFULLLY GET Movie" , data:{movies , totalCount}})
    } catch (err) {
        console.log('err.....', err)
        return res.status(constants.WEB_STATUS_CODE.SERVER_ERROR).send({status:constants.STATUS_CODE.FAIL , message:"Something went wrong. Please try again later."})
    }
}



exports.get_movie_by_id = async (req, res, next) => {

    try {
     
        const { movieId } = req.query;
      const movie = await Movie.findOne({_id : movieId})

      return res.status(constants.WEB_STATUS_CODE.OK).send({status:constants.STATUS_CODE.SUCCESS , message:"SUCESSFULLLY GET MOVIES" , movie})

    } catch (err) {
        console.log('err.....', err)
        return res.status(constants.WEB_STATUS_CODE.SERVER_ERROR).send({status:constants.STATUS_CODE.FAIL , message:"Something went wrong. Please try again later."})
    }
}


exports.movie_rating = async (req, res, next) => {

    try {
     
        const trendingMovies = await Movie.find({} , {rating:1 , title:1 , genre:1}).sort({ popularity: -1 }).limit(10);
        return res.status(constants.WEB_STATUS_CODE.OK).send({status:constants.STATUS_CODE.SUCCESS , message:"SUCESSFULLLY GET MOVIES RATING" ,  trendingMovies})

    } catch (err) {
        console.log('err.....', err)
        return res.status(constants.WEB_STATUS_CODE.SERVER_ERROR).send({status:constants.STATUS_CODE.FAIL , message:"Something went wrong. Please try again later."})
    }
}


exports.update_movie = async (req, res, next) => {

    try {
     
        const { movieId } = req.query;
        const reqBody = req.body
        const userId =  req.user._id;

        const { title,releaseYear,description } = reqBody;

        let user = await User.findOne({ _id: userId}) 

        if(user.user_type == 2) 
        return res.status(constants.WEB_STATUS_CODE.BAD_REQUEST).send({status:constants.STATUS_CODE.FAIL , message:"Only Admin can be added movie"})
        
        reqBody.updated_at = await dateFormat.set_current_timestamp();
        const movie = await Movie.findOneAndUpdate({_id:  movieId } ,reqBody , {new:true})

       return res.status(constants.WEB_STATUS_CODE.OK).send({status:constants.STATUS_CODE.SUCCESS , message:"MOVIE SUCESSFULLLY UPDATED" , movie})

    } catch (err) {
        console.log('err.....', err)
        return res.status(constants.WEB_STATUS_CODE.SERVER_ERROR).send({status:constants.STATUS_CODE.FAIL , message:"Something went wrong. Please try again later."})
    }
}


exports.delete_movie = async (req, res, next) => {

    try {
     
        const { movieId } = req.query;
        const reqBody = req.body
        const userId =  req.user._id;

        const { title,releaseYear,description } = reqBody;

        let user = await User.findOne({ _id: userId}) 

        if(user.user_type == 2) 
        return res.status(constants.WEB_STATUS_CODE.BAD_REQUEST).send({status:constants.STATUS_CODE.FAIL , message:"Only Admin can be added movie"})
        
        reqBody.delete_at = await dateFormat.set_current_timestamp();
        const movie = await Movie.findOneAndDelete({_id : movieId})

       return res.status(constants.WEB_STATUS_CODE.OK).send({status:constants.STATUS_CODE.SUCCESS , message:"MOVIE SUCESSFULLLY DELETED" , movie})

    } catch (err) {
        console.log('err.....', err)
        return res.status(constants.WEB_STATUS_CODE.SERVER_ERROR).send({status:constants.STATUS_CODE.FAIL , message:"Something went wrong. Please try again later."})
    }
}



