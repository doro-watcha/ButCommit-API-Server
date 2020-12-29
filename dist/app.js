"use strict";

var _Authenticator = _interopRequireDefault(require("./Authenticator"));

var _httpErrors = _interopRequireDefault(require("http-errors"));

var _express = _interopRequireDefault(require("express"));

var _path = _interopRequireDefault(require("path"));

var _cookieParser = _interopRequireDefault(require("cookie-parser"));

var _morgan = _interopRequireDefault(require("morgan"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _swaggerDoc = _interopRequireDefault(require("./swaggerDoc"));

var _index = _interopRequireDefault(require("./routes/index"));

var _models = _interopRequireDefault(require("./models"));

var _controllers = require("./controllers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express.default)(); // view engine setup

app.set('views', _path.default.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(_bodyParser.default.json());
app.use((0, _morgan.default)('dev'));
app.use(_express.default.json());
app.use(_express.default.urlencoded({
  extended: false
}));
app.use((0, _cookieParser.default)());
app.use(_express.default.static(_path.default.join(__dirname, 'public')));
app.use(_bodyParser.default.urlencoded({
  extended: false
}));
app.use('/', _index.default);
(0, _swaggerDoc.default)(app);

_models.default.sequelize.sync({
  alter: true
}).then(() => {
  // initialize passport
  const passport = _Authenticator.default.initialize(app);

  app.use(passport.initialize());

  _controllers.scoreTransitionController.parse();

  console.log("good");
  app.listen(process.env.PORT, () => console.log(`App listening on port 3000`));
}).catch(error => {
  console.log("bad");
  console.error(error.message);
}); // catch 404 and forward to error handler


app.use(function (req, res, next) {
  next((0, _httpErrors.default)(404));
}); // error handler

app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {}; // render the error page

  res.status(err.status || 500);
  res.render('error');
});
app.listen(3000);
module.exports = app;