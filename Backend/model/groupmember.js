const sequelize=require('../util/database');
const Sequelize=require('sequelize');

const GroupMembership = sequelize.define('group_membership', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    isAdmin:{
        type:Sequelize.BOOLEAN,
        defaultValue: false
    }
});

module.exports=GroupMembership;