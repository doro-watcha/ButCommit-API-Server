"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _joi = _interopRequireDefault(require("@hapi/joi"));

var _mime = _interopRequireDefault(require("mime"));

var _path = _interopRequireDefault(require("path"));

var _fs = _interopRequireDefault(require("fs"));

var _xlsx = _interopRequireDefault(require("xlsx"));

var _services = require("../services");

var _functions = require("../utils/functions");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class fileController {
  static async uploadMajor(req, res) {
    try {
      const files = await _joi.default.validate(req.files, {
        excel: _joi.default.array().min(1).required()
      });
      const response = {
        success: true
      };
      res.send(response);
    } catch (e) {
      res.send((0, _functions.createErrorResponse)(e));
    }
  }

  static async donwloadMajor(req, res) {
    try {
      const file = '../excelfile/major.xlsx';

      const mimetype = _mime.default.getType(file);

      const filename = _path.default.basename(file);

      res.download(file, 'major.xlsx');
    } catch (e) {
      res.send((0, _functions.createErrorResponse)(e));
    }
  }

  static async parseMajor(req, res) {
    try {
      await _services.majorService.deleteAll();
      await _services.majorDataService.deleteAll();
      const path = '../excelfile/major.xlsx';

      let workbook = _xlsx.default.readFile(path, {
        sheetRows: 5523
      });

      let sheetsList = workbook.SheetNames;

      let sheetData = _xlsx.default.utils.sheet_to_json(workbook.Sheets[sheetsList[1]], {
        header: 1,
        defval: '',
        blankrows: true
      }); //console.log(sheetData)


      let data = [];

      for (let i = 3; i < 5523; i++) {
        /*
         * 앞부분만 떼가지고 Major를 하나 만들어준다 ( 이거는 연도에 상관없는 metadata이므로 major로 구분 )
         */
        let obj1 = {
          id: i - 2,
          line: sheetData[i][0],
          // 인문 
          group: sheetData[i][1],
          // 다 
          location: sheetData[i][2],
          // 경남
          univName: sheetData[i][3],
          // 가야대 
          recruitmentType: sheetData[i][4],
          // 일반학생
          sosokUniversity: sheetData[i][5],
          // 소속대학
          recruitmentUnit: sheetData[i][6],
          // 경찰행정학과 
          majorName: sheetData[i][7] // 경찰행정학과 

        };
        await _services.majorService.create(obj1);
      } // 2021년 


      for (let i = 3; i < 5523; i++) {
        let korean_ratio = sheetData[i][58];
        let math_ratio = sheetData[i][59];
        let english_ratio = sheetData[i][60];
        let tamgu_ratio = sheetData[i][61];
        let foreign_ratio = sheetData[i][62];
        let history_ratio = sheetData[i][63];
        let english_multiple_value = sheetData[i][64];
        let history_multiple_value = sheetData[i][65];
        let parsed_data = {
          korean: -1,
          english: 0,
          math_ga: 0,
          math_na: 0,
          tamgu_society: 0,
          tamgu_science: 0,
          history: -1,
          foreign: foreign_ratio
        };
        parsed_data.korean = korean_ratio;
        parsed_data.english = english_ratio;
        parsed_data.history = history_ratio; // 수학 반영비율에서 가,나에 대해서 숫자만 파싱

        if (math_ratio.indexOf('가') >= 0) {
          parsed_data.math_ga = math_ratio.replace(/[^0-9]/g, '');
        }

        if (math_ratio.indexOf('나') >= 0) {
          parsed_data.math_na = math_ratio.replace(/[^0-9]/g, '');
        } // 탐구 반영비율에서 사,과에 대해서 숫자만 파싱 


        if (tamgu_ratio.length > 0 && tamgu_ratio.indexOf('사') >= 0) {
          parsed_data.tamgu_society = tamgu_ratio.replace(/[^0-9]/g, '');
        }

        if (tamgu_ratio.length > 0 && tamgu_ratio.indexOf('과') >= 0) {
          parsed_data.tamgu_science = tamgu_ratio.replace(/[^0-9]/g, '');
        } //예외처리


        var value = -1;
        if (sheetData[i][35].length > 0) value = sheetData[i][35].indexOf("우수한 영역 순");
        /**
         * 33.3 같은 경우에는 파싱을 하면 333이 되는데 이게 100보다 작을것같으면 나누기 10을 한다거나 하고
         * 28.15 같은 경우에도 파싱을 하면 2815가 되는데 나누기 100을해서 28.15로 제대로 파싱을 해주는 코드 
         */

        while (parsed_data.korean > 100) parsed_data.korean = parsed_data.korean / 10;

        while (parsed_data.english > 100) parsed_data.english = parsed_data.english / 10;

        while (parsed_data.math_ga > 100) parsed_data.math_ga = parsed_data.math_ga / 10;

        while (parsed_data.math_na > 100) parsed_data.math_na = parsed_data.math_na / 10;

        while (parsed_data.tamgu_science > 100) parsed_data.tamgu_science = parsed_data.tamgu_science / 10;

        while (parsed_data.tamgu_society > 100) parsed_data.tamgu_society = parsed_data.tamgu_society / 10;

        while (parsed_data.history > 100) parsed_data.history = parsed_data.history / 10;

        var recommendationScore = 0;

        if (sheetData[i][24].length > 2 && sheetData[i][26].length > 2) {
          recommendationScore = (sheetData[i][24] + sheetData[i][25]) / 2;
        }

        if (value >= 0) {
          parsed_data.korean = 35;
          parsed_data.math_ga = 25;
          parsed_data.math_na = 25;
        }

        let obj2 = {
          id: i - 2,
          year: 2021,
          majorId: i - 2,
          metadata: {
            initialMember: sheetData[i][11],
            // 1
            additionalMember: sheetData[i][12],
            // 14
            competitionRate: sheetData[i][18],
            // 2.33
            reflectionSubject: sheetData[i][38],
            // 탐,한+국,수,영중 택2
            calculationSpecial: sheetData[i][39],
            tamguNumber: sheetData[i][40],
            // 1 
            applicationIndicator: sheetData[i][43],
            // 백분위 X 비율 
            applicationIndicatorType: sheetData[i][42],
            // A
            tamguTranslation: sheetData[i][44],
            tamguReplace: sheetData[i][45],
            specialOption: sheetData[i][47],
            extraType: sheetData[i][49],
            // 특정 영역 가산 ex ) 수가 5%, 과탐 3% 가산
            extraSubject: sheetData[i][50],
            extraValue: sheetData[i][51],
            extraPoint: sheetData[i][53],
            perfectScore: sheetData[i][56],
            // 총 만점 ex) 700 ,
            basicScore: sheetData[i][57],
            emv: english_multiple_value,
            hmv: history_multiple_value
          },
          prediction: {
            strong: sheetData[i][30],
            safe: sheetData[i][31],
            dangerous: sheetData[i][32],
            sniping: sheetData[i][33]
          },
          recommendationScore: recommendationScore,
          ratio: {
            korean: parsed_data.korean,
            // (40)
            math: {
              ga: parsed_data.math_ga,
              na: parsed_data.math_na
            },
            // 수가나 (40)
            english: parsed_data.english,
            // (40)
            tamgu: {
              society: parsed_data.tamgu_society,
              science: parsed_data.tamgu_science
            },
            // 사과직 10 
            foreign: parsed_data.foreign,
            history: parsed_data.history // 10 

          },
          gradeToScore: {
            english: {
              way: sheetData[i][66],
              // 수능비율포함 
              score: sheetData[i].slice(67, 76)
            },
            history: {
              way: sheetData[i][77],
              // 수능비율포함
              score: sheetData[i].slice(78, 87)
            }
          }
        };
        await _services.majorDataService.create(obj2);
      } // for ( let i = 3; i < 5650 ; i++) { 
      //   let obj3 = {
      //     id : 2 * i - 4,
      //     year : 2021,
      //     majorId : i-2,
      //     metadata : {
      //       initialMember : sheetData[i][11],
      //       additionalMember : sheetData[i][12],
      //       competitionRate : sheetData[i][16],
      //       reflectionSubject : sheetData[i][28],
      //       tamguNumber : sheetData[i][30],
      //       applicationIndicator : sheetData[i][32],
      //       extraPoint : sheetData[i][68],
      //       perfectScore : sheetData[i][74]
      //     }
      //   }
      //   await majorDataService.create(obj3)
      // }


      const response = {
        success: true
      };
      res.send(response);
    } catch (e) {
      res.send((0, _functions.createErrorResponse)(e));
    }
  }

  static async uploadUniv(req, res) {
    try {
      const files = await _joi.default.validate(req.files, {
        excel: _joi.default.array().min(1).required()
      });
      const response = {
        success: true
      };
      res.send(response);
    } catch (e) {
      res.send((0, _functions.createErrorResponse)(e));
    }
  }

  static async downloadUniv(req, res) {
    try {
      const file = '../excelfile/university.xlsx';

      const mimetype = _mime.default.getType(file);

      const filename = _path.default.basename(file);

      res.download(file, 'university.xlsx');
    } catch (e) {
      res.send((0, _functions.createErrorResponse)(e));
    }
  }

  static async parseUniv(req, res) {
    try {
      await _services.universityService.deleteAll();
      const path = '../excelfile/university.xlsx';

      let workbook = _xlsx.default.readFile(path, {
        sheetRows: 1574
      });

      let sheetsList = workbook.SheetNames;

      let sheetData = _xlsx.default.utils.sheet_to_json(workbook.Sheets[sheetsList[0]], {
        header: 1,
        defval: '',
        blankrows: true
      });

      let data = [];

      for (let i = 1; i < 1574; i++) {
        let obj1 = {
          id: i,
          name: sheetData[i][0],
          line: sheetData[i][1],
          group: sheetData[i][2],
          location: sheetData[i][3],
          type: sheetData[i][4],
          min: sheetData[i][5],
          max: sheetData[i][6]
        };
        await _services.universityService.create(obj1);
      }

      const response = {
        success: true
      };
      res.send(response);
    } catch (e) {
      res.send((0, _functions.createErrorResponse)(e));
    }
  }

}

exports.default = fileController;