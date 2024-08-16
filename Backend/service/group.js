const Group=require('../model/group');
const GroupMembership=require('../model/groupmember')
const Message=require('../model/message')
const sequelize=require('../util/database')
const { Op } = require('sequelize');


module.exports.newGroup=async (req) => {
    const t=await sequelize.transaction();
    const { name } = req.body;
    try {
        const group = await Group.create({ name ,transaction:t});
        await GroupMembership.create({ groupId: group.id, userId: req.user.id,transaction:t });
        t.commit();
        return{status:201,message:'Group created', group:group }
        
    } catch (error) {
        t.rollback();
        console.log(error);
        
      return {status:500,error:error.message} ;   
    }
}

module.exports.JoinGroup=async (req) => {
    const { groupId } = req.params;
   
    const t=await sequelize.transaction();
try{
    const membership = await GroupMembership.create({ groupId, userId: req.user.id ,transaction:t});
    t.commit();
    return {status:201,message:'Joined group',membership:membership};
}
catch(error)
{
    t.rollback();
    console.log(error);
    
  return {status:500,error:error.message} ;  
}
}

module.exports.getUSer=async (req) => {    
    
    try {
        const groups = await Group.findAll({
            include: {
                model: GroupMembership,
                where: { userId: req.user.id }
            }
        });
       
        
        return {groups}
    }
    catch(error)
    {
        return {status:500,error:error.message} ; 
    }
    
}

module.exports.getMessage = async (req) =>{
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
        const messages = await Message.findAll(queryOptions);
        const messageData = messages.reverse(); 
        return { message: messageData };
    } catch (error) {
        return {status:500,error:error.message} ; 
    }
}

module.exports.createMessage=async(req)=>{
    const { groupId } = req.params;
    const { message } = req.body;
const t=await sequelize.transaction();


try{
    const newMessage = await Message.create({
        message,
        groupId,
        userId: req.user.id,
        name:req.user.name,
        transaction:t
    });

    t.commit();
    return {status:201,message:newMessage}; 
}

catch(e)
{

    console.log(e);
        
    await t.rollback();
 
    return { status: 409, error: e.message };
}
}
module.exports.joinGroup2=async(req) => {
        console.log("in join             ");

    const t=await sequelize.transaction();
    try {
        
        const { groupName } = req.body;
        const userId = req.user.id;

        // Find the group by name
        const group = await Group.findOne({ where: { name: groupName } });
        if (!group) {
            return {status:404,error:"Group not found"}
        }

        // Check if the user is already a member
        const isMember = await  GroupMembership.findOne({where:{userId:req.user.id}});
        if (isMember) {
            return {status:404,error:"You are already a member of this group"}
        }

        // Add the user to the group
     await GroupMembership.create({ groupId:group.id, userId: req.user.id ,transaction:t});
      t.commit();
      return{status:200,message:`Joined group "${groupName}" successfully`};

    } catch (error) {
        t.rollback();
        console.error(error);
        return {status:500,error:error.message} ; 
    }


}