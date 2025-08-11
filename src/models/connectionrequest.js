const mongoose=require('mongoose');
const connectuserschema=new mongoose.Schema({
    fromuserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"user",
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"user",
    },
    Status:{
        type:String,
        required:true,
        enum:{
            values:["ignore","interested","accepted","rejected"],
            message:`{VALUE} is incorrect status type`,
        },
    },
},{timestamps:true});
connectuserschema.pre("save",function(next){
    const connectionreq=this;
    if(connectionreq.fromuserId.equals(connectionreq.toUserId)){
        throw new Error("connection request send to urlsef");
    }
    next();
})
const connectionRequest=new mongoose.model("connectionRequest",connectuserschema);

module.exports=connectionRequest;