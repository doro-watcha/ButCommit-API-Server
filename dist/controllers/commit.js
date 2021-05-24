"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _joi = _interopRequireDefault(require("@hapi/joi"));

var _axios = _interopRequireDefault(require("axios"));

var _cheerio = _interopRequireDefault(require("cheerio"));

var _functions = require("../utils/functions");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import { commitService } from '../services'
class commitController {
  static async crawl(req, res) {
    try {
      const result = await _joi.default.validate(req.query, {
        username: _joi.default.string().required(),
        startDate: _joi.default.date().required()
      });
      const {
        username,
        startDate
      } = result;
      const commits = [];
      const html = await _axios.default.get("https://github.com/" + username);

      const $ = _cheerio.default.load(html.data);

      $('.ContributionCalendar-day').each(function (index, element) {
        const date = element.attribs['data-date'];

        const _date = new Date(date);

        if (date != undefined && _date >= startDate) {
          commits.push({
            count: parseInt(element.attribs['data-count']),
            date
          });
        }
      });
      commits.sort(function (a, b) {
        a = new Date(a.date);
        b = new Date(b.date);
        return a > b ? -1 : a < b ? 1 : 0;
      });
      const response = {
        success: true,
        data: {
          commits
        }
      };
      res.send(response);
    } catch (e) {
      res.send((0, _functions.createErrorResponse)(e));
    }
  }

}

exports.default = commitController;