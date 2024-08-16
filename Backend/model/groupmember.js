const sequelize=require('../util/database');
const Sequelize=require('sequelize');

const GroupMembership = sequelize.define('group_membership', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    }
});

module.exports=GroupMembership;