const express=require('express');
const { UserAuth } = require('../middlewares/auth');
const userRouter=express.Router();
const connectionRequestmodel=require('../models/connectionrequest');

userRouter.get("/user/request/received",UserAuth,async(req,res)=>{
    try{
     const loggedinuser=req.user;
     const connectionrequest=await connectionRequestmodel.find({
        toUserId:loggedinuser,
        Status:"interested"
     }).populate("fromuserId","firstName lastName age");
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
    }).populate("fromuserId","firstName lastName").populate("toUserId","firstName lastName");
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

module.exports=userRouter;