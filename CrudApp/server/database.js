'use strict';
import userModel from './models/users.js';
import Sequelize from 'sequelize';
import  Config from './config.js';
const config = Config.development;
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: config.dialect,
    define: {
      freezeTableName: true,
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    // http://docs.sequelizejs.com/manual/tutorial/querying.html#operators
    operatorsAliases: false,
})

const seqModel = userModel(sequelize, Sequelize)
db[seqModel.name] = seqModel
db.sequelize = sequelize;
db.Sequelize = Sequelize;
export default db;