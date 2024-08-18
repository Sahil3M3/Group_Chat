const Group = require('../model/group');
const GroupMembership = require('../model/groupmember');
const Message = require('../model/message');
const sequelize = require('../util/database');
const { Op } = require('sequelize');
const User=require('../model/user')

module.exports.newGroup = async (req) => {
    const t = await sequelize.transaction();
    try {
        const group = await Group.create({ name: req.body.name, creatorId: req.user.id }, { transaction: t });
        await GroupMembership.create({ groupId: group.id, userId: req.user.id, isAdmin: true }, { transaction: t });
        await t.commit();
        return { status: 201, message: 'Group created', group: group };
    } catch (error) {
        console.log(error);        
        await t.rollback();
        return { status: 500, error: error.message };
    }
};

module.exports.JoinGroup = async (req) => {
    const { groupId } = req.params;
    const t = await sequelize.transaction();
    try {
        const membership = await GroupMembership.create({ groupId, userId: req.user.id }, { transaction: t });
        await t.commit();
        return { status: 201, message: 'Joined group', membership: membership };
    } catch (error) {
        await t.rollback();
        console.log(error);
        return { status: 500, error: error.message };
    }
};

module.exports.getGroups = async (req) => {    
    try {
        const groups = await Group.findAll({
            include: {
                model: GroupMembership,
                where: { userId: req.user.id }
            }
        });
        return { groups };
    } catch (error) {
        return { status: 500, error: error.message }; 
    }
};

module.exports.getMessage = async (req) => {
    const { groupId } = req.params;
    const afterId = req.query.afterId ? parseInt(req.query.afterId) : 0;
    
    const queryOptions = {
        where: { groupId },
        order: [['id', 'ASC']],
        limit: 10
    };

    if (afterId) {
        queryOptions.where.id = { [Op.gt]: afterId };
    }

    try {
        const msg = await Message.findAll(queryOptions);
        const messages = msg;        
        return { messages: messages };
    } catch (error) {
        return { status: 500, error: error.message }; 
    }
};

module.exports.createMessage = async (req) => {
    const { groupId } = req.params;
    const { message } = req.body;
    const t = await sequelize.transaction();
    try {
        const newMessage = await Message.create({
            message,
            groupId,
            userId: req.user.id,
            name: req.user.name,
            transaction: t
        });
        await t.commit();
        return { status: 201, message: newMessage }; 
    } catch (e) {
        console.log(e);
        await t.rollback();
        return { status: 409, error: e.message };
    }
};

module.exports.joinGroup2 = async (req) => {
    const t = await sequelize.transaction();
    try {
        const { groupName } = req.body;
        const userId = req.user.id;

        // Find the group by name
        const group = await Group.findOne({ where: { name: groupName } });
        if (!group) {
            return { status: 404, error: "Group not found" };
        }

        // Check if the user is already a member
        const isMember = await GroupMembership.findOne({ where: { groupId: group.id, userId } });
        if (isMember) {
            return { status: 404, error: "You are already a member of this group" };
        }

        // Add the user to the group
        await GroupMembership.create({ groupId: group.id, userId: userId }, { transaction: t });
        await t.commit();
        return { status: 200, message: `Joined group "${groupName}" successfully` };

    } catch (error) {
        await t.rollback();
        console.error(error);
        return { status: 500, error: error.message }; 
    }
};

module.exports.updateAdminStatus = async (req) => {
    const { groupId } = req.params;
    const { isAdmin } = req.body; // true to promote, false to demote
 const email=req.body.email;
 console.log("Email is "+email);
 
    const t = await sequelize.transaction();
    try {
        const group = await Group.findByPk(groupId, { include: GroupMembership });
        if (!group) {
            return { status: 404, error: "Group not found" };
        }

        const requestingUserMembership = await GroupMembership.findOne({ 
            where: { groupId, userId: req.user.id }
        });

        if (!requestingUserMembership || !requestingUserMembership.isAdmin) {
            return { status: 403, error: "You are not authorized to perform this action" };
        }

        const u=await User.findOne({where:{email}});
        if(!u)
        return { status: 404, error: "User is not Register" };

        const targetUserMembership = await GroupMembership.findOne({ 
            where: { groupId, userId:u.id }
        });

        if (!targetUserMembership) {
            return { status: 404, error: "User is not a member of the group" };
        }

        await targetUserMembership.update({ isAdmin }, { transaction: t });
        await t.commit();
        return { status: 200, message: "Admin status updated successfully" };
    } catch (error) {
        await t.rollback();
        return { status: 500, error: error.message };
    }
};

module.exports.removeUserFromGroup = async (req) => {
    const { groupId,email } = req.params;

    const t = await sequelize.transaction();
    try {
        const group = await Group.findByPk(groupId);
        if (!group) {
            return { status: 404, error: "Group not found" };
        }

        const requestingUserMembership = await GroupMembership.findOne({ 
            where: { groupId, userId: req.user.id }
        });

        if (!requestingUserMembership || !requestingUserMembership.isAdmin) {
            return { status: 403, error: "You are not authorized to perform this action" };
        }

        const u=await User.findOne({where:{email}});
        if(!u)
        return { status: 404, error: "User is not Register" };

        const targetUserMembership = await GroupMembership.findOne({ where: { groupId, userId:u.id } });
        if (!targetUserMembership) {
            return { status: 404, error: "User is not a member of the group" };
        }

        await targetUserMembership.destroy({ transaction: t });
        await t.commit();
        return { status: 200, message: "User removed from group successfully" };
    } catch (error) {
        await t.rollback();
        return { status: 500, error: error.message };
    }
};

module.exports.MemberByEmail=async (req) => {
    const { groupId } = req.params;
const userId=req.user.id;
    const {memberInfo}=req.body;
    const t = await sequelize.transaction()
    try{
    const newUser=await User.findOne({where:{ email:memberInfo}});
    if(!newUser)
        return{status:404,error:"User Not Found,Enter check Email"}

    const group = await Group.findByPk(groupId);
    if (!group) {
        return { status: 404, error: "Group not found" };
    }

    const requestingUserMembership = await GroupMembership.findOne({ 
        where: { groupId, userId: req.user.id }
    });

    if (!requestingUserMembership || !requestingUserMembership.isAdmin) {
        return { status: 403, error: "You are not authorized to perform this action" };
    }

    const membership = await GroupMembership.create({ groupId, userId: newUser.id,isAdmin:false }, { transaction: t });
    await t.commit();
    return { status: 201, message: 'Joined group', membership: membership };

}
catch(error)
{
    await t.rollback();
    console.log(error);    
    return { status: 500, error: error.message };
}
}