"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _passport = _interopRequireDefault(require("passport"));

var _passportJwt = require("passport-jwt");

var _functions = require("./utils/functions");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// singleton instance
let instance = null;

class Authenticator {
  constructor() {
    if (!instance) {
      console.log('Authenticator 생성' + this);
      instance = this;
    }

    return instance;
  }

  initialize(app) {
    // from auth header
    const jwtStrategyOption = {
      jwtFromRequest: _passportJwt.ExtractJwt.fromAuthHeaderWithScheme('jwt'),
      passReqToCallback: true,
      secretOrKey: 'token-secret-staging'
    };
    const jwtStrategy = new _passportJwt.Strategy(jwtStrategyOption, async (req, payload, done) => {
      try {
        const user = await userService.findOne({
          id: payload.id
        });
        if (user) done(null, user);else done(null, false);
      } catch (e) {
        done(e, null);
      }
    });

    _passport.default.use('jwt', jwtStrategy); // middleware 로 설정


    app.use(_passport.default.initialize());
    this.passport = _passport.default;
    return _passport.default;
  }

  authenticate(req, res, next) {
    instance.passport.authenticate('jwt', {
      session: false
    }, (error, user) => {
      // [ERROR] INVALID_TOKEN
      if (!user) {
        const response = (0, _functions.createErrorResponse)(new Error('INVALID_TOKEN'));
        return res.send(response);
      } // [ERROR] Internal Server Error


      if (error) {
        return res.send((0, _functions.createErrorResponse)());
      }

      req.user = user;
      next();
    })(req, res, next);
  }

  getUserInfo(req, res, next) {
    instance.passport.authenticate('jwt', {
      session: false
    }, (error, user) => {
      // [ERROR] Internal Server Error
      if (error) {
        return res.send((0, _functions.createErrorResponse)());
      }

      req.user = user;
      next();
    })(req, res, next);
  } // middleware to check admin role


  admin(req, res, next) {
    instance.passport.authenticate('jwt', {
      session: false
    }, (error, user) => {
      // [ERROR] INVALID_TOKEN
      if (!user) {
        const response = (0, _functions.createErrorResponse)(new Error('INVALID_TOKEN'));
        return res.send(response);
      } // [ERROR] NO_ACCESS


      if (user.role !== 'admin') {
        const response = (0, _functions.createErrorResponse)(new Error('NO_ACCESS'));
        return res.send(response);
      } // [ERROR] Internal Server Error


      if (error) {
        return res.send((0, _functions.createErrorResponse)());
      }

      req.user = user;
      next();
    })(req, res, next);
  }

} // export singleton instance


var _default = new Authenticator();

exports.default = _default;