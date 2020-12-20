import Authenticator from './Authenticator'
import createError from 'http-errors'
import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import bodyParser from 'body-parser'

import swaggerDoc from './swaggerDoc'

import indexRouter from './routes/index'
import models from './models'



var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyParser.json());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', indexRouter);

var options = {
  dotfiles: 'ignore',
  etag: true,
  extensions: ['htm', 'html'],
  index: false,
  maxAge: '1d',
  redirect: false,
  setHeaders: function (res, path, stat) {
    res.set('Cache-Control', `no-cache, private, max-age=36000`)
  }
}

app.use(express.static('public', options));
swaggerDoc(app)

models.sequelize
	.sync({ alter: true })
	.then(() => {
		// initialize passport
		const passport = Authenticator.initialize(app)
    app.use(passport.initialize())

    console.log("good")

		app.listen(process.env.PORT, () => console.log(`App listening on port 3000`))
	})
	.catch((error) => {
    console.log("bad")
		console.error(error.message)
	})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



app.listen(3000);
module.exports = app;