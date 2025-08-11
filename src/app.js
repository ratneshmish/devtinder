const express=require('express');
const connectDB=require("./config/database");

const app=express();


const cookie=require('cookie-parser');



app.use(express.json());
app.use(cookie());

const authrouter=require('./routes/auth');
const ProfileRouter=require('./routes/profile');
const Requestrouter=require('./routes/requests');
const userRouter=require('./routes/user');
app.use("/",authrouter);
app.use("/",ProfileRouter);
app.use("/",Requestrouter);
app.use("/",userRouter);
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
