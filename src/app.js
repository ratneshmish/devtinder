const express=require('express');
const app=express();
app.use("/test",(req,res)=>{
    res.send("Hello budyy");
})
app.listen(5000,()=>{
    console.log("server is running at port 5000");
})