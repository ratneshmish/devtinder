const connectionRequestmodel=require('../models/connectionrequest');
const express=require('express');
const Requestrouter=express.Router();
const {UserAuth}=require('../middlewares/auth');
const User=require('../models/user');
Requestrouter.post("/sendconnection/:status/:userId",UserAuth,async(req,res)=>{
    try{
const fromuserId=req.user._id;
const toUserId=req.params.userId;
const Status=req.params.status;
const Allowedstatus=["ignore","interested"];
if(!Allowedstatus.includes(Status)){
   return res.status(400).json({message:"Invalid Status"});
}
const userexist=await User.findById(toUserId);
if(!userexist){
    res.status(400).json({message:"User not found"});
}
const existingconnectionrequest=await connectionRequestmodel.findOne({
    $or:[{
        fromuserId,toUserId
    },{
        fromuserId:toUserId,toUserId:fromuserId
    }]
})
if(existingconnectionrequest){
    return res.status(400).json({message:"Connection already existed"});
}
const connectionRequest=new connectionRequestmodel({
    fromuserId:fromuserId,
    toUserId:toUserId,
    Status:Status,
})
const data=await connectionRequest.save();
res.json({
    message:"connection send successfully",
    data,
})
}
catch(err){
  res.status(400).send(err.message);
}
})

Requestrouter.post("/send/request/review/:status/:request_id",UserAuth,async(req,res)=>{
    try{
    const loggedinUser=req.user;
    const {status,request_id}=req.params;
    const Allowedstatus=["accepted","rejected"];
    if(!Allowedstatus.includes(status)){
       return res.status(400).json({message:"status not valid"});
    }
    const validationforconnection=await connectionRequestmodel.findOne({
        _id:request_id,
        Status:"interested",
        toUserId:loggedinUser._id
    })
    if(!validationforconnection){
       return  res.status(400).json({message:"connection request not found"})
    }
    validationforconnection.Status=status;
    const data=await validationforconnection.save();
    return res.json({message:"connection Request "+ status,data});
}
catch(err){
res.status(400).send("Error "+err.message);
}
     

})
module.exports=Requestrouter;