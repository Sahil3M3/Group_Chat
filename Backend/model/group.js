const sequelize=require('../util/database');
const Sequelize=require('sequelize');

const Group=sequelize.define('group',{

    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true

    },
    name:{
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
    },
    creatorId:{
        type: Sequelize.STRING,
        allowNull: false,
    }

});

module.exports=Group;