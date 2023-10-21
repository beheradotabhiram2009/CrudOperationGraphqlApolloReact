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
