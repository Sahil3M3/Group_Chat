const sequelize=require('../util/database');
const Sequelize=require('sequelize')

const ArchivedChat=sequelize.define('ArchivedChat',{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    message: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

module.exports=ArchivedChat;