"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.schema = exports.default = void 0;

var _sequelize = _interopRequireDefault(require("sequelize"));

var _bcrypt = _interopRequireDefault(require("bcrypt"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class User extends _sequelize.default.Model {
  static init(sequelize) {
    return super.init({
      name: {
        type: _sequelize.default.STRING,
        allowNull: false
      },
      email: {
        type: _sequelize.default.STRING,
        allowNull: true
      },
      telephone: {
        type: _sequelize.default.STRING,
        allowNull: true
      },
      password: {
        type: _sequelize.default.STRING,
        allowNull: false
      },
      haknyeon: {
        type: _sequelize.default.STRING,
        allowNull: true
      },
      highSchool: {
        type: _sequelize.default.STRING,
        allowNull: true
      },
      line: {
        type: _sequelize.default.STRING,
        allwoNull: true
      },
      gender: {
        type: _sequelize.default.STRING,
        allowNull: true
      },
      graduateYear: {
        type: _sequelize.default.INTEGER,
        defaultValue: -1
      },
      editTimes: {
        type: _sequelize.default.INTEGER,
        defaultValue: 5
      },
      isMoneyPaid: {
        type: _sequelize.default.INTEGER,
        defaultValue: 1
      },
      adminLevel: {
        type: _sequelize.default.INTEGER,
        defaultValue: 0
      },
      searchScore: {
        type: _sequelize.default.FLOAT,
        allowNull: true
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
    }, {
      sequelize
    });
  }

  static hashPassword(unencryptedPwd) {
    return _bcrypt.default.hashSync(unencryptedPwd, 8);
  }

  isValidPassword(unencryptedPwd) {
    return _bcrypt.default.compareSync(unencryptedPwd, this.password);
  }

  static associate(models) {
    this.hasMany(models.Report, {
      foreignKey: 'userId',
      as: 'report'
    }), this.belongsTo(models.Academy, {
      foreignKey: 'academyId',
      as: 'academy'
    }), this.hasMany(models.Consulting, {
      foreignKey: 'userId',
      as: 'consulting'
    }), this.hasMany(models.PaymentRecord, {
      foreignKey: 'userId',
      as: 'paymenetRecord'
    }), this.hasMany(models.Score, {
      foreignKey: 'userId',
      as: 'score'
    });
    this.hasMany(models.FinalReport, {
      foreignKey: 'userId',
      as: 'finalReport'
    });
    this.hasMany(models.Comment, {
      foreignKey: 'userId',
      as: 'comment'
    });
  }

  toJSON() {
    const object = Object.assign({}, this.dataValues); // delete some (key, value)

    delete object.createdAt;
    delete object.updatedAt;
    delete object.password;
    delete object.academyId;
    return object;
  }

} // swagger schema


exports.default = User;
const schema = {
  type: 'object',
  properties: {
    id: {
      type: 'integer',
      example: 3
    },
    name: {
      type: 'string',
      example: '안지영'
    },
    email: {
      type: 'string',
      example: 'Bol4@gmail.com'
    },
    telephone: {
      type: 'string',
      example: "010-7270-5880"
    },
    haknyeon: {
      type: 'string',
      example: '3학년'
    },
    password: {
      type: 'string',
      example: 'password'
    },
    highSchool: {
      type: 'string',
      example: '볼사고등학교'
    },
    line: {
      type: 'string',
      example: '문과'
    },
    gender: {
      type: 'string',
      example: '남'
    },
    graduateYear: {
      type: 'integer',
      example: '2013'
    },
    searchScore: {
      type: 'float',
      example: '96.3'
    },
    predictTimes: {
      type: 'integer',
      example: 3
    },
    academy: {
      $ref: '#/components/schemas/Academy'
    }
  },
  required: ['id', 'email', 'password', 'name']
};
exports.schema = schema;