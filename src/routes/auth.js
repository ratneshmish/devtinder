const express=require('express');
const authRouter=express.Router();
const bcrypt=require('bcrypt');
const User=require('../models/user');
const {signupvalidation}=require('../utils/validation');
authRouter.post("/login",async(req,res)=>{
 try{
    const {email,password}=req.body;
    const user=await User.findOne({email});
    if(!user){
       throw new Error("Invalid email or password");
    }
    const verifypass= await bcrypt.compare(password,user.password)
    if(!verifypass){
        throw new Error("Invalid email or password");
    }
    else{
    
    const token= await user.getjwt();
    
    res.cookie("token", token);
    res.send("Login successful");
    }
 }
 catch(err){
    res.status(400).send("Error: "+err.message);
 }
})

authRouter.post("/signup",async(req,res)=>{
try{
    //validation of data
    signupvalidation(req);
    const {password,email,lastName,firstName}=req.body;
//encryption of password

 const passwordhash=  await bcrypt.hash(password, 10);
    const user=new User({
    firstName,
    lastName,
    password:passwordhash,
    email,
    });
await user.save();
res.send("user added successfully");
}
catch(err){
    res.status(400).send({Error:err.message});
}
    }
)
authRouter.post("/logout",async(req,res)=>{
    res.cookie("token",null,{
        expires:new Date(Date.now()),
    });
  res.send("Logout successfully");
})
module.exports=authRouter;