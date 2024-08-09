const User=require('../model/user')
const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt')
const sequelize=require('../util/database')

module.exports.signUp=async(req)=>{

    
    const{email,phone,password,name}=req.body;
    const salt=5;
    const t=await sequelize.transaction();
    try{
const hash=await bcrypt.hash(password,salt);
const user=
{    email:email,
    phone:phone,
    password:hash,
    name:name
       };

       const r=await User.create(user,{transaction:t});
       console.log(r);
       
     await  t.commit();

       return {status:201,message:"User is Added"};
    }
    catch(e)
    {
        console.log(e);
        
        await t.rollback();
     
        return { status: 409, error: e.message };
    }
    

}