var createError = require('http-errors');
var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cookie = require('cookie-session');
const flash = require('connect-flash');
const seriesRouter = require('./admin/routes/series')
const episodeRouter = require('./admin/routes/esipsode')
const movieRouter = require('./admin/routes/movie')
const usersRouter = require('./v1/routes/users');
const adminRouter = require('./admin/routes/admin');
const seasonRouter = require('./admin/routes/season');
const app = express();


app.use(flash());

app.use(
  cookie({
    // Cookie config, take a look at the docs...
    secret: 'I Love India...',
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: true
    },
  }),
);


//Database connection with mongodb
const mongoose = require('./config/database');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());

app.use('/v1/users', usersRouter);
app.use('/admin', adminRouter);
app.use('/admin/movies' , movieRouter);
app.use('/admin/series' , seriesRouter);
app.use('/admin/episode' , episodeRouter)
app.use('/admin/season' , seasonRouter)


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  console.log("err..........", err)
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;