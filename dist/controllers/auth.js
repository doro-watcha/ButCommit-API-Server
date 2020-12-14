"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _joi = _interopRequireDefault(require("@hapi/joi"));

var _axios = _interopRequireDefault(require("axios"));

var _awsSdk = _interopRequireDefault(require("aws-sdk"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _functions = require("../utils/functions");

var _variables = require("../utils/variables");

var _services = require("../services");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv.default.config();

// aws s3
const s3 = new _awsSdk.default.S3({
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  Bucket: process.env.S3_BUCKET_NAME
});

class AuthController {
  static async token(req, res) {
    try {
      // user info from middlewawre: Authenticator.authenticate
      const {
        user
      } = req; // get user info

      const foundUser = await _services.userService.findOne({
        id: user.id
      }); // create response

      const response = {
        success: true,
        data: {
          user: foundUser
        }
      };
      res.send(response);
    } catch (e) {
      res.send((0, _functions.createErrorResponse)(e));
    }
  }

  static async signUp(req, res) {
    try {
      // validation
      const result = await _joi.default.validate(req.body, {
        email: _joi.default.string().required(),
        password: _joi.default.string().regex(_variables.passwordRegex).required(),
        name: _joi.default.string().required(),
        haknyeon: _joi.default.string(),
        highSchool: _joi.default.string(),
        line: _joi.default.string(),
        graduateYear: _joi.default.number(),
        telephone: _joi.default.string(),
        gender: _joi.default.string(),
        adminLevel: _joi.default.number(),
        academyId: _joi.default.number().optional()
      });
      const {
        email,
        password,
        name,
        haknyeon,
        highSchool,
        line,
        graduateYear,
        telephone,
        gender,
        academyId,
        adminLevel
      } = result; // check if user already exists

      const user = await _services.userService.findOne({
        email
      }); // [ERROR] USER_ALREADY_EXISTS

      if (user) throw Error('USER_ALREADY_EXISTS'); // create user

      const success = await _services.userService.create({
        name,
        email,
        password,
        highSchool,
        haknyeon,
        line,
        graduateYear,
        telephone,
        gender,
        academyId,
        adminLevel
      }); // create response

      const response = {
        success: success
      };
      res.send(response);
    } catch (e) {
      res.send((0, _functions.createErrorResponse)(e));
    }
  }

  static async signIn(req, res) {
    try {
      const result = await _joi.default.validate(req.body, {
        email: _joi.default.string().required(),
        password: _joi.default.string().regex(_variables.passwordRegex).required()
      });
      const {
        email,
        password
      } = result; // get user info

      let user = await _services.userService.findOne({
        email
      }); // [ERROR] USER_NOT_FOUND

      if (!user) throw Error('USER_NOT_FOUND'); // [ERROR] PASSWORD_MISMATCH

      if (!user.isValidPassword(password)) throw Error('PASSWORD_MISMATCH'); // issue token

      const token = _jsonwebtoken.default.sign({
        id: user.id,
        email: user.email
      }, 'token-secret-staging', {
        expiresIn: '60 days'
      }); // create response


      const response = {
        success: true,
        data: {
          token,
          user
        }
      };
      res.send(response);
    } catch (e) {
      console.log(e);
      res.send((0, _functions.createErrorResponse)(e));
    }
  }

  static async academyIn(req, res) {
    try {
      const result = await _joi.default.validate(req.body, {
        name: _joi.default.string().required(),
        password: _joi.default.string().regex(_variables.passwordRegex).required()
      });
      const {
        name,
        password
      } = result;
      let academy = await _services.academyService.findOne({
        name
      });
      if (!academy) throw Error('ACADEMY_NOT_FOUND'); // [ERROR] PASSWORD_MISMATCH

      if (!academy.isValidPassword(password)) throw Error('PASSWORD_MISMATCH'); // issue token

      const token = _jsonwebtoken.default.sign({
        id: academy.id,
        name: academy.name
      }, 'token-secret-staging', {
        expiresIn: '60 days'
      }); // create response


      const response = {
        success: true,
        data: {
          token,
          academy
        }
      };
      res.send(response);
    } catch (e) {
      res.send((0, _functions.createErrorResponse)(e));
    }
  }

}

exports.default = AuthController;