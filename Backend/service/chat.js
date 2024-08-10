const Message=require('../model/message')
const sequelize=require('../util/database')

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
    return {status:201,message:"Message is Added"};
}

catch(e)
{

    console.log(e);
        
    await t.rollback();
 
    return { status: 409, error: e.message };
}
}

module.exports.getMessage=async (req) => {
    console.log("in get mesg");
try{

    const message=await Message.findAll();
    const messageData = message.map(msg => msg.dataValues);

const response = {
  message:messageData
};

return response;
}
catch(e)
{
    console.error("Error fetching Message:", error);
    throw new Error("Error fetching Message");
}
    
    
}