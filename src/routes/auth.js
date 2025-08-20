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
    
    res.cookie("token", token,{
  httpOnly: true,                            // protects from XSS
  secure: true,                              // required on HTTPS
  sameSite: "none",                          // required for cross-origin
  path: "/",
    });
    res.send(user);
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
    const {password,email,lastName,firstName,gender,age}=req.body;
//encryption of password

 const passwordhash=  await bcrypt.hash(password, 10);
    const user=new User({
    firstName,
    lastName,
    password:passwordhash,
    email,
    age,
    gender,
    });
    const saveduser=await user.save();
  const token=await saveduser.getjwt();
   res.cookie("token", token,{
  httpOnly: true,                            // protects from XSS
  secure: true,                              // required on HTTPS
  sameSite: "none",                          // required for cross-origin
  path: "/",
   });
   res.json({message:"user added successfully",data:saveduser});

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