"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.schema = exports.default = void 0;

var _sequelize = _interopRequireDefault(require("sequelize"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Report extends _sequelize.default.Model {
  static init(sequelize) {
    return super.init({
      score: {
        type: _sequelize.default.JSON,
        allowNull: true
      },
      extraScore: {
        type: _sequelize.default.JSON,
        allowNull: true
      },
      perfectScore: {
        type: _sequelize.default.JSON,
        allowNull: true
      },
      actualPerfectScore: {
        type: _sequelize.default.INTEGER,
        allowNull: true
      },
      recommendations: {
        type: _sequelize.default.JSON,
        allowNull: true
      },
      naesinScore: {
        type: _sequelize.default.FLOAT,
        defaultValue: 0.0
      },
      totalScore: {
        type: _sequelize.default.FLOAT,
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
    this.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    }), this.belongsTo(models.MajorData, {
      foreignKey: 'majorDataId',
      as: 'majorData'
    }), this.hasMany(models.FinalReport, {
      foreignKey: 'reportId',
      as: 'finalReport'
    });
  }

  toJSON() {
    const object = Object.assign({}, this.dataValues); // delete some (key, value)

    delete object.createdAt;
    delete object.updatedAt;
    delete object.userId;
    delete object.majorDataId;
    delete object.majorId;
    return object;
  }

} // swagger schema


exports.default = Report;
const schema = {
  type: 'object',
  properties: {
    id: {
      type: 'integer',
      example: 3
    },
    score: {
      type: 'json',
      example: {
        korean: 198.214,
        math: 219.643,
        english: 0,
        tamgu: 182.357,
        history: 0
      }
    },
    extraScore: {
      type: 'json',
      example: {
        korean: 0,
        math: 0,
        english: 0,
        tamgu: 0,
        history: 10
      }
    },
    perfectScore: {
      type: 'json',
      example: {
        korean: 357.1,
        math: 357.1,
        english: 0,
        tamgu: 285.7,
        history: 0
      }
    },
    user: {
      $ref: '#/components/schemas/User'
    },
    major: {
      $ref: '#/components/schemas/Major'
    },
    createdAt: {
      type: _sequelize.default.DATE,
      allowNull: false,
      defaultValue: _sequelize.default.literal('CURRENT_TIMESTAMP')
    },
    updatedAt: {
      type: _sequelize.default.DATE,
      allowNull: false,
      defaultValue: _sequelize.default.literal('CURRENT_TIMESTAMP'),
      onUpdate: _sequelize.default.literal('CURRENT_TIMESTAMP')
    }
  },
  required: ['id', 'score', 'user', 'major']
};
exports.schema = schema;