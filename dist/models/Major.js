"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.schema = exports.default = void 0;

var _sequelize = _interopRequireDefault(require("sequelize"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Major extends _sequelize.default.Model {
  static init(sequelize) {
    return super.init({
      // 계열
      line: {
        type: _sequelize.default.STRING,
        allowNull: true
      },
      // 군별
      group: {
        type: _sequelize.default.STRING,
        allowNull: true
      },
      // 위치
      location: {
        type: _sequelize.default.STRING,
        allowNull: true
      },
      // 모집 전형
      recruitmentType: {
        type: _sequelize.default.STRING,
        allowNull: true
      },
      // 대학 이름
      univName: {
        type: _sequelize.default.STRING,
        allowNull: true
      },
      sosokUniversity: {
        type: _sequelize.default.STRING,
        allowNull: true
      },
      //모집 단위
      recruitmentUnit: {
        type: _sequelize.default.STRING,
        allowNull: true
      },
      //세부 전공
      majorName: {
        type: _sequelize.default.STRING,
        allowNull: true
      },
      createdAt: {
        type: _sequelize.default.DATE,
        allowNull: true,
        defaultValue: _sequelize.default.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: _sequelize.default.DATE,
        allowNull: true,
        defaultValue: _sequelize.default.literal('CURRENT_TIMESTAMP'),
        onUpdate: _sequelize.default.literal('CURRENT_TIMESTAMP')
      }
    }, {
      sequelize
    });
  }

  static associate(models) {
    this.hasMany(models.MajorData, {
      foreignKey: 'majorId',
      as: 'majorData'
    });
  }

  toJSON() {
    const object = Object.assign({}, this.dataValues); // delete some (key, value)

    delete object.createdAt;
    delete object.updatedAt;
    return object;
  }

} // swagger schema


exports.default = Major;
const schema = {
  type: 'object',
  properties: {
    id: {
      type: 'integer',
      example: 3
    },
    line: {
      type: 'string',
      example: '인문'
    },
    group: {
      type: 'string',
      example: '가나'
    },
    location: {
      type: 'string',
      example: '충남'
    },
    recruitmentType: {
      type: 'string',
      example: '일반전형'
    },
    univName: {
      type: 'string',
      example: '고려대'
    },
    recruitmentUnit: {
      type: 'string',
      example: '자율전공'
    },
    majorName: {
      type: 'string',
      example: '자율전공학부'
    }
  },
  required: ['id', 'name', 'univ']
};
exports.schema = schema;