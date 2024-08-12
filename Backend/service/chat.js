const Message=require('../model/message')
const sequelize=require('../util/database')
const { Op } = require('sequelize');

module.exports.createMessage=async(req)=>{
    const userId=req.user.id;
    const {message}=req.body
const t=await sequelize.transaction();


try{

    await Message.create({
        message:message,
        userId:userId
    },{transaction:t})

    await t.commit()
    return {status:201,message:{
        id:userId,message:message
    }};
}

catch(e)
{

    console.log(e);
        
    await t.rollback();
 
    return { status: 409, error: e.message };
}
}

module.exports.getMessage = async (req) => {
    const afterId = req.query.afterId ? parseInt(req.query.afterId) : 0;

    const queryOptions = {
        attributes: ['id', 'message'], 
        order: [['id', 'DESC']],      
        limit: 10                      
    };

    if (afterId) {
        queryOptions.where = { id: { [Op.gt]: afterId } };
    }

    try {
        const messages = await Message.findAll(queryOptions);
        const messageData = messages.reverse(); 
        return { message: messageData };
    } catch (error) {
        console.error("Error fetching messages:", error);
        throw new Error("Error fetching messages");
    }
};