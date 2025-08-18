const express=require('express');
const { UserAuth } = require('../middlewares/auth');
const userRouter=express.Router();
const connectionRequestmodel=require('../models/connectionrequest');
const User=require("../models/user");
const { set } = require('mongoose');

userRouter.get("/user/request/received",UserAuth,async(req,res)=>{
    try{
     const loggedinuser=req.user;
     const connectionrequest=await connectionRequestmodel.find({
        toUserId:loggedinuser,
        Status:"interested"
     }).populate("fromuserId","firstName lastName photoUrl about");
     res.json({message:"data fetched successfuly",
        data:connectionrequest
    })
    }
    catch(err){
       res.status(400).send("ERROR " + err.message);

    }
})
userRouter.get("/user/connection",UserAuth,async(req,res)=>{
    try{
    const loggedinUser=req.user;
    const connectionreq=await connectionRequestmodel.find({
        $or:[{toUserId:loggedinUser,Status:"accepted"},{fromuserId:loggedinUser,Status:"accepted"}],
    }).populate("fromuserId","firstName lastName about photoUrl").populate("toUserId","firstName lastName about photoUrl");
    const data=await connectionreq.map((row)=>{if(row.fromuserId._id.toString()===loggedinUser._id.toString()){
        return row.toUserId;
    }
    return row.fromuserId;
    });
    res.json({message:"here are the connections",data});
}
catch(err){
    res.status(400).send("ERROR"+err.message);
}

})
userRouter.get("/feed",UserAuth,async(req,res)=>{
    try{
        const page=parseInt(req.query.page)||1;
        let limit=parseInt(req.query.limit)||10;
        limit=limit>20?20:limit;
        const skip=(page-1)*limit;
      const loggedinUser=req.user;
      const connection=await connectionRequestmodel.find({
        $or:[
            {fromuserId:loggedinUser._id},{toUserId:loggedinUser._id}
        ]
      }).select("fromuserId toUserId");
      const hideuser=new Set();
      connection.forEach(element => {
        hideuser.add(element.fromuserId);
        hideuser.add(element.toUserId);
      });
   const users=await User.find({
   $and:[{ _id:{$nin:Array.from(hideuser)}},
    {_id:{$ne:loggedinUser._id}},
   ],
   }).select("firstName lastName photoUrl age skills gender about").skip(skip).limit(limit);
res.send(users);
    }
    catch(err){
res.status(400).json({message:"ERROR"+err.message});
    }
})
module.exports=userRouter;