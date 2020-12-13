"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.schema = exports.default = void 0;

var _sequelize = _interopRequireDefault(require("sequelize"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class University extends _sequelize.default.Model {
  //연도, 계열, 모집군, 전형, 경쟁률, 최초 모집인원, 수시이월 인원, 최종 모집인원, 내신반영 유무, 특이사항, 비고
  static init(sequelize) {
    return super.init({
      // 대학 이름 
      name: {
        type: _sequelize.default.STRING,
        allowNull: true
      },
      // 지원 가능 점수중 작은값
      min: {
        type: _sequelize.default.STRING,
        allowNull: true
      },
      // 지원 가능 점수중 높은 값
      max: {
        type: _sequelize.default.STRING,
        allowNull: true
      },
      group: {
        type: _sequelize.default.STRING,
        allowNull: true
      },
      location: {
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

  static associate(models) {}

  toJSON() {
    const object = Object.assign({}, this.dataValues); // delete some (key, value)

    delete object.createdAt;
    delete object.updatedAt;
    return object;
  }

} // swagger schema


exports.default = University;
const schema = {
  type: 'object',
  properties: {
    id: {
      type: 'integer',
      example: 3
    },
    name: {
      type: 'string',
      example: '고려대'
    },
    group: {
      type: 'string',
      example: '가'
    },
    min: {
      type: 'float',
      example: '340'
    },
    max: {
      type: 'float',
      example: '660'
    },
    location: {
      type: 'string',
      example: '서울'
    },
    line: {
      type: 'string',
      example: '인문'
    }
  },
  required: ['id', 'name', 'min', 'max', 'location']
};
exports.schema = schema;