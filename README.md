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
### npm init
### npm i @apollo/server
### npm install express
### npm install cors
### npm install mysql2
### npm i http
### npm i sequelize
### npm install graphql
### type package.json (You can see all the packages installed)
### Write follwing code in index.js under server directory

