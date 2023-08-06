const dateFormat = require("../../helper/dateformat.helper");
const constants = require("../../config/constants");
const User = require("../../models/user.model");
const Series = require("../../models/series.model");
const Season = require("../../models/season.model");
const Episode = require('../../models/episode.model')

exports.add_episode = async (req, res, next) => {

  try {

    const reqBody = req.body;
    const { seasonId } = req.params;
    const userId = req.user._id;
     const { title, duration, description } = reqBody;

    let user = await User.findOne({ _id: userId });

    if (user.user_type == 2)
      return res
        .status(constants.WEB_STATUS_CODE.BAD_REQUEST)
        .send({
          status: constants.STATUS_CODE.FAIL,
          message: "Only Admin can be added",
        });

        const season = await Season.findById(seasonId);
        if (!season) {
          return res
          .status(constants.WEB_STATUS_CODE.BAD_REQUEST)
          .send({
            status: constants.STATUS_CODE.FAIL,
            message: "season not found",
          });
        }
        reqBody.created_at = await dateFormat.set_current_timestamp();
        reqBody.updated_at = await dateFormat.set_current_timestamp();
        const episode = new Episode({ season: seasonId, title, duration, description });
        await episode.save();
    
        season.episodes.push(episode);
        await season.save();

    return res
      .status(constants.WEB_STATUS_CODE.CREATED)
      .send({
        status: constants.STATUS_CODE.SUCCESS,
        message: "SUCESSFULLLY ADD NEW EPISODE",
      });

  } catch (err) {

    console.log("err.....", err);
    return res
      .status(constants.WEB_STATUS_CODE.SERVER_ERROR)
      .send({
        status: constants.STATUS_CODE.FAIL,
        message: "Something went wrong. Please try again later.",
      });
  }
};



exports.get_all_episode = async (req, res, next) => {

    try {

      const { seriesId } = req.query;
     
      if (!seriesId)
        return res
          .status(constants.WEB_STATUS_CODE.BAD_REQUEST)
          .send({
            status: constants.STATUS_CODE.FAIL,
            message: "Series id not found",
          });
  
      const series = await Series.findById(seriesId);
  
      if (!series)
        return res
          .status(constants.WEB_STATUS_CODE.BAD_REQUEST)
          .send({
            status: constants.STATUS_CODE.FAIL,
            message: "Series not found",
          });

    const seasons = await Episode.find({ series: seriesId }).populate('season')
  
      return res
        .status(constants.WEB_STATUS_CODE.OK)
        .send({
          status: constants.STATUS_CODE.SUCCESS,
          message: "SUCESSFULLLY GET ALL SEASONS",
          seasons,
        });
  
    } catch (err) {
  
      console.log("err.....", err);
      return res
        .status(constants.WEB_STATUS_CODE.SERVER_ERROR)
        .send({
          status: constants.STATUS_CODE.FAIL,
          message: "Something went wrong. Please try again later.",
        });
    }
  };
  
  
  




