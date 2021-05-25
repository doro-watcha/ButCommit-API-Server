"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _functions = require("../utils/functions");

var _models = require("../models");

var _firebaseAdmin = _interopRequireDefault(require("firebase-admin"));

var _firebaseAdminsdk = _interopRequireDefault(require("../firebase-adminsdk"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _axios = _interopRequireDefault(require("axios"));

var _cheerio = _interopRequireDefault(require("cheerio"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv.default.config();

_firebaseAdmin.default.initializeApp({
  credential: _firebaseAdmin.default.credential.cert(_firebaseAdminsdk.default)
});

let instance = null;

class FcmService {
  constructor() {
    if (!instance) {
      console.log('Fcm Service is created' + this);
      instance = this;
    }

    return instance;
  }

  async checkCommit() {
    //   let target_token =
    //   'cGwH-muAS7uuOqfNyNC8ws:APA91bHLgss3F8RoC_wUw9HvGr-KSLhavSp5HEpuLLYtDEM_8Vjw-I57JJaK4y7O6E_8KjRm0IfAWbKS9JurI12r0eekGOiCd21oj9gl7PxuonUrJldS7LjPreYpTlSqe1Zdsh2_5vj7'
    // //target_token은 푸시 메시지를 받을 디바이스의 토큰값입니다
    const users = await _models.User.findAll();
    console.log(users);

    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      if (user.isDoing == false) continue;
      const html = await _axios.default.get("https://github.com/" + user.username).catch(function (error) {
        if (error.response.status == 404) {
          throw Error('USER_NOT_FOUND');
        }
      });

      const $ = _cheerio.default.load(html.data);

      const length = $('.ContributionCalendar-day').length;
      console.log($('.ContributionCalendar-day')[length - 6].attribs);
      const lastCommitCount = $('.ContributionCalendar-day')[length - 6].attribs['data-count'];
      console.log("length = " + length);
      console.log("lastCommitCount" + lastCommitCount);

      if (lastCommitCount == "0") {
        let message = {
          data: {
            title: '커밋 독촉',
            body: '아직 커밋을 안하셨어요. 서둘러 커밋해주세요!'
          },
          token: user.fcmToken
        };

        _firebaseAdmin.default.messaging().send(message).then(function (response) {
          console.log('Successfully sent message: : ', response);
        }).catch(function (err) {
          console.log(err);
        });
      }
    }
  }

  async send(message) {
    await _firebaseAdmin.default.messaging().send(message).then(response => {
      console.log("push success");
      return true;
    }).catch(e => {
      console.log("push fail");
      return false;
    });
  }

  async subscribe(token, topic) {
    await _firebaseAdmin.default.messaging().subscribeToTopic(token, topic).then(response => {
      return true;
    }).catch(e => {
      // res.send(createErrorResponse(e))
      console.log(e);
      return false;
    });
  }

  async unsubscribe(token, topic) {
    await _firebaseAdmin.default.messaging().unsubscribeFromTopic(token, topic).then(response => {
      return true;
    }).catch(e => {
      // res.send(createErrorResponse(e))
      console.log(e);
      return false;
    });
  }

}

var _default = new FcmService();

exports.default = _default;