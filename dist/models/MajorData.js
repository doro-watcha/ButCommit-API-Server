"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.schema = exports.default = void 0;

var _sequelize = _interopRequireDefault(require("sequelize"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class MajorData extends _sequelize.default.Model {
  static init(sequelize) {
    return super.init({
      year: {
        type: _sequelize.default.INTEGER,
        defaultValue: 0
      },

      /**
       *  initialMember(모집인원), additionalMember(수시이월인원) , competitionRate(경쟁률), reflectionSubject(반영과목), tamguNumber(탐구반영갯수) , applicationIndicator(수능활용지표), extraPoint(가산점에 대한 설명), perfectScore ( 만점 )
       **/
      metadata: {
        type: _sequelize.default.JSON,
        allowNull: true
      },

      /**
       * 유력, 적정, 위험, 스나이핑 점수 4개 ( strong, safe, dangerous , sniping)
       */
      prediction: {
        type: _sequelize.default.JSON,
        allowNull: true
      },

      /**
       * 과목별 반영비율 ( korean, math , english , tamgu, foreign, history )
       */
      ratio: {
        type: _sequelize.default.JSON,
        allowNull: true
      },

      /**
       * 가산점 
       */
      extra: {
        type: _sequelize.default.JSON,
        allowNull: true
      },

      /**
       * 영어, 한국사는 등급밖에 없으므로 등급을 점수화해주는 뱌열
       */
      gradeToScore: {
        type: _sequelize.default.JSON,
        allowNull: true
      },
      recommendationScore: {
        type: _sequelize.default.FLOAT,
        allowNull: true
      }
    }, {
      sequelize
    });
  }

  static associate(models) {
    this.belongsTo(models.Major, {
      foreignKey: 'majorId',
      as: 'major'
    }), this.hasMany(models.Report, {
      foreignKey: 'majorDataId',
      as: 'report'
    }), this.hasMany(models.FinalReport, {
      foreignKey: 'majorDataId',
      as: 'finalReport'
    });
  }

  toJSON() {
    const object = Object.assign({}, this.dataValues); // delete some (key, value)

    delete object.createdAt;
    delete object.updatedAt;
    delete object.majorId;
    return object;
  }

} // swagger schema


exports.default = MajorData;
const schema = {
  type: 'object',
  properties: {
    id: {
      type: 'integer',
      example: 3
    },
    year: {
      type: 'integer',
      exammple: 2020
    },
    metadata: {
      type: 'json',
      example: {
        initialMember: 3,
        additionalMember: 4,
        competitionRate: 4.3,
        reflectionSubject: '국수영사',
        tamguNumber: 3,
        applicationIndicator: '백분위',
        extraPoint: '수가10퍼센트 더준다고~'
      }
    },
    prediction: {
      type: 'json',
      example: {
        strong: 600.3,
        safe: 603.4,
        dangerous: 234.3,
        sniping: 234.3
      }
    },
    ratio: {
      type: 'json',
      example: {
        korean: 40,
        englsih: 30,
        math: {
          ga: 30,
          na: 30
        },
        tamgu: {
          science: 30,
          society: 30
        },
        foreign: 30,
        history: 40
      }
    },
    gradeToScore: {
      type: 'json',
      example: {
        englsih: {
          way: '수능반영비율',
          score: [1, 2, 3, 4, 5, 6, 6, 6]
        },
        history: {
          way: '수능반영비율',
          score: [1, 2, 3, 4, 5, 5, 5, 5]
        }
      }
    }
  }
};
exports.schema = schema;