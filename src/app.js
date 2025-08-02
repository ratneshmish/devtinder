const express=require('express');
const connectDB=require("./config/database");
const bcrypt=require('bcrypt');
const app=express();
const User=require('./models/user');
const {signupvalidation}=require('./utils/validation');
app.use(express.json());
app.post("/signup",async(req,res)=>{
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
app.get("/user",async(req,res)=>{
    const useremail=req.body.email;
   const user= await User.findOne({email:useremail});
   if(!user){
    res.status(400).send("something is wrong");
   }
   else{
    res.send(user);
   }

})
app.delete("/delete",async(req,res)=>{
    const userId=req.body.userId;
   
    try{
         const user=await User.findByIdAndDelete(userId);
         res.send("User deleted successfully");
    }
    catch(err){
        res.status(400).send("something went wrong in deletion");
    }
})
app.patch("/patch",async(req,res)=>{
    const userId=req.body.userId;
    const data=req.body;
   
    try{
         const ALLLOWED_UPDATES=["age","gender","password","skills"];
         const isUpdated=Object.keys(data).every((k)=>ALLLOWED_UPDATES.includes(k));
    if(!isUpdated){
        throw new Error("updation not allowed");
    }
        await User.findByIdAndUpdate(userId,data,{runValidators:true});
        res.send("user updated successfully");
    }
    catch(err){
        res.status(400).send("something went wrong in updation" + ":"+err.message);
    }
})
app.post("/login",async(req,res)=>{
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
    res.send("Login successful");
 }
 catch(err){
    res.status(400).send("Error: "+err.message);
 }
})

connectDB()
.then(()=>{
console.log("database is connected");
app.listen(5000,()=>{
    console.log("server is running at port 5000");
});
})
.catch((err)=>{
console.log("failed to connect with database");
})
