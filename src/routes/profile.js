const express=require('express');
const ProfileRouter=express.Router();
const User=require('../models/user');
const {UserAuth}=require("../middlewares/auth");
const {validateprofiledata}=require("../utils/validation");

ProfileRouter.get("/profile/view",UserAuth,async(req,res)=>{
    try{
    
     const user=req.user;
          res.send(user);
                    }
          catch(err){
            res.status(400).send("Error: "+err.message);
          }
})
ProfileRouter.patch("/profile/edit",UserAuth,async(req,res)=>{
  try{
    if(!validateprofiledata(req)){
      throw new Error("Cannot edit this");
    }
    const user=req.user;
    Object.keys(req.body).forEach((key)=>(user[key]=req.body[key]));
    await user.save();
    res.send(`${user.firstName}, your profile has been updated`);
  }
  catch(err){
  res.status(400).send("ERROR :"+err.message);
  }
})
module.exports=ProfileRouter;