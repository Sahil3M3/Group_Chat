const userService=require('../service/user')

module.exports.userSignup=async(req,res)=>{

 
        const result=await userService.signUp(req);
        return res.status(result.status).json({ message: result.message, error: result.error });
 
}

module.exports.userLogin=async(req,res)=>{

        const result=await userService.login(req)
      //  return res.status(result.status).json({ message: result.message, error: result.error });

}       