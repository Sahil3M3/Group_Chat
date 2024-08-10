const chatservice=require('../service/chat');

module.exports.newMassage=async(req,res,next)=>{


    const result=await chatservice.createMessage(req);
    return res.status(result.status).json({ message: result.message, error: result.error });

}

module.exports.getAllMessage=async (req,res,next) => {

    try {
    
        const message = await chatservice.getMessage(req);
        
        res.status(200).json(message);
      } catch (error) {
        console.error("Error fetching Message:", error);
        res.status(500).json({ msg: "Internal server error" });
      }
}