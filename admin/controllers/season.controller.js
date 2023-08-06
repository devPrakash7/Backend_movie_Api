const dateFormat = require("../../helper/dateformat.helper");
const constants = require("../../config/constants");
const User = require("../../models/user.model");
const Series = require("../../models/series.model");
const Season = require("../../models/season.model");


exports.add_season = async (req, res, next) => {
  try {
    const reqBody = req.body;
    const userId = req.user._id;
    const { seriesId } = req.params;
    const { seasonNumber } = reqBody;

    let user = await User.findOne({ _id: userId });

    if (user.user_type == 2)
      return res
        .status(constants.WEB_STATUS_CODE.BAD_REQUEST)
        .send({
          status: constants.STATUS_CODE.FAIL,
          message: "Only Admin can be added movie",
        });

    const series = await Series.findById(seriesId);

    if (!series)
      return res
        .status(constants.WEB_STATUS_CODE.BAD_REQUEST)
        .send({
          status: constants.STATUS_CODE.FAIL,
          message: "Series not found",
        });
    reqBody.created_at = await dateFormat.set_current_timestamp();
    reqBody.updated_at = await dateFormat.set_current_timestamp();
    const season = new Season({ series: seriesId, seasonNumber });
    let add_new_season = await season.save();

    return res
      .status(constants.WEB_STATUS_CODE.CREATED)
      .send({
        status: constants.STATUS_CODE.SUCCESS,
        message: "SUCESSFULLLY ADD NEW SEASON",
        add_new_season,
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



exports.get_all_season = async (req, res, next) => {
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

    const seasons = await Season.find({ series: seriesId }).populate('series')
  
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
  
  
  
  



