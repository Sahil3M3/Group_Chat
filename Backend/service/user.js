const User=require('../model/user')
const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt')
const sequelize=require('../util/database');
const { where } = require('sequelize');

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

        await User.create(user,{transaction:t});
       
       
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

module.exports.login=async(req)=>{

    console.log(req.body);
    const {email,password}=req.body;
    const t=await sequelize.transaction();

    try{
const user=await User.findOne({where:{email:email}})
if(user)
{
console.log(user);
const isValid=await bcrypt.compare(password,user.password);

    if(isValid)
    {
        return { status: 200, message: "Login successful", token: generateToken(user.id) };
    }
    else
    {
        return { status: 401, message: "Password is Wrong" };
    }

}
else{
    return{status:404,message:"User Not Found"};   
}

    }
    catch(e)
    {
        console.log(e);
        
        await t.rollback();
     
        return { status: 409, error: e.message };
    }
    
}

function generateToken(id){
    const key = "sahil";

    return jwt.sign({ userId: id }, key);
}