const sequelize=require('sequelize');

const Sequelize=new sequelize('groupchat','root','manager',{dialect:"mysql"})

module.exports=Sequelize;