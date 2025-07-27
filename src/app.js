const express=require('express');
const connectDB=require("./config/database");
const app=express();
const User=require('./models/user');
app.use(express.json());
app.post("/signup",async(req,res)=>{
    console.log(req.body);
    const user=new User(req.body)

try{
await user.save();
res.send("user added successfully");
}
catch(err){
    res.status(400).send("something is wrong with user data");
}
    }
)

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
