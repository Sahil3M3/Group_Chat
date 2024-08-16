const groupService=require('../service/group')

module.exports.createGroup=async (req,res,next) => {
    
        const result=await groupService.newGroup(req);
        return res.status(result.status).json({ message: result.message,group: result.group,error: result.error });
}


module.exports.JoinGroup=async (req,res,next) => {
    
    const result=await groupService.JoinGroup(req);
    return res.status(result.status).json({ message: result.message,membership: result.membership,error: result.error });
}

module.exports.getMember=async (req,res,next) => {
    
    const result=await groupService.getUSer(req);

   res.status(200).json(result);
}

module.exports.getAllMessage=async (req,res,next) => {

    try {
    
        const message = await groupService.getMessage(req);
          
        res.status(200).json(message);
      } catch (error) {
        console.error("Error fetching Message:", error);
        res.status(500).json({ msg: "Internal server error" });
      }
}


module.exports.newMassage=async(req,res,next)=>{


    const result=await groupService.createMessage(req);
    return res.status(result.status).json({ message: result.message, error: result.error });

}
module.exports.joinGroup2=async (req,res,next) => {
    
    const result=await groupService.joinGroup2(req);
    console.log(result);
    
    return res.status(result.status).json({ message: result.message, error: result.error });
}