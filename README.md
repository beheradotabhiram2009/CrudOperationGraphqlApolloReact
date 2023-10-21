## CrudOperationGraphqlApolloReact
Demo Example provides crud operation using graphql apollo from MySQL database using image and date field

Download and install mysql 8.1

create a database userapp and a table users by using following sql
```sql
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `email` varchar(45) DEFAULT NULL,
  `job_title` varchar(45) DEFAULT NULL,
  `content` longtext,
  `joining_date` date DEFAULT NULL,
  `mime` varchar(20),
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
);
```
insert sample rows.

download and install node.js 

run windows powershell/ command prompt

Create a directory server, change to server directory

Write the following commands in sequence : 

```npm init```
```npm i @apollo/server```
```npm i express```
```npm install cors```
```npm install mysql2```
```npm i http```
```npm i sequelize```
```npm install graphql```

type package.json (You can see all the packages installed)

add following in package.json for using ES6
```json
"type": "module",
```
Write follwing code in index.js under server directory
```js
import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import cors from 'cors';
import http from 'http';
import {typeDefs, resolvers} from './Graphql/users.js';
import db from './database.js';

const app = express();
app.use(express.json({ limit: '15gb' }));
app.use(cors());
const httpServer = http.createServer(app);
const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});
await server.start();
app.use(
  '/graphql',
  expressMiddleware(server, {
    context: async ({ req }) => ({DB:db}),
  }),
);

new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
console.log(`🚀 Server ready at http://localhost:4000/graphql`);
```
Write follwing code in database.js under server directory
```js
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
```
Write follwing code in config.js under server directory
```js
const Config = {
    "development": {
      "username": "root",
      "password": "root",
      "database": "userapp",
      "host": "localhost",
      "dialect": "mysql",
      "port":"3036"
    },
  };
  
  export default Config;
```
create two folders models and Graphql under server directory

Write follwing code in users.js under Graphql folder
```js
import { GraphQLScalarType, Kind} from 'graphql';
 
const resolverDate = {
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    parseValue(value) {
      return value; // value from the client
    },
    serialize(value) {
      return value; // value sent to the client
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return ast.value // ast value is always in string format
      }
      return null;
    },
    extensions: {
      codegenScalarType: 'Date | string',
      jsonSchema: {
        type: 'string',
        format: 'date',
      },
    },
  }),
};
  
 export const typeDefs = `
    scalar Date
    type Query {
        users: [User]
        user(id: Int): User
    }
    type User {
        id: Int
        email: String
        name: String
        job_title:String
        joining_date:Date
        content:String
        mime:String
    }
    type Mutation {
      updateUser(id: Int, name: String, email: String, job_title: String, 
        joining_date: Date, content: String, mime: String): User,
      createUser(name: String, email: String, job_title: String, joining_date: Date, 
        content: String, mime: String): User,
      deleteUser(id: Int): Int
    }
`;

export const resolvers = {
  Query: {
    users: async (obj, args, context) => context.DB.users.findAll(),
    user: async (obj, args, context) => context.DB.users.findByPk(args.id)
  },  

  Mutation: {
    createUser : async (obj, args, context) => {
      try {
        return await context.DB.users.create({
          name:args.name, 
          email:args.email, 
          job_title:args.job_title, 
          joining_date:args.joining_date, 
          content:args.content,
          mime:args.mime,
        });
      } catch (err) {alert(err);}
    },  

    deleteUser : async(obj, args, context) => {
      try {
        return await context.DB.users.destroy({
          where: { id:args.id }
        });
      } catch (err) {alert(err)}
    },  

    updateUser : async(obj, args, context) => {
      try {
        return await context.DB.users.update({
          name:args.name, 
          email:args.email, 
          job_title:args.job_title, 
          joining_date:args.joining_date,
          content:args.content,
          mime:args.mime},
          {where: { id:args.id }
        });
      } catch (err) {alert(err);}
    }
  }
};
```
Write follwing code in users.js under models folder
```js
'use strict';

const userModel = (sequelize, DataTypes) => {
	return sequelize.define('users', {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false
		},
    	job_title: DataTypes.STRING,
    	joining_date: DataTypes.DATE,
    	content: DataTypes.TEXT('long'),
		mime: DataTypes.STRING,
		}, {
		tableName: 'users',
		timestamps: false
	});
}

export default userModel;
```
type ```node index.js``` to check if the server is running

