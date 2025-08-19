const express=require('express');
const connectDB=require("./config/database");
const http=require('http');
const app=express();
const cors=require('cors');
const initializesocket=require('./utils/socket');
require("dotenv").config()

// console.log(process.env.MONGO_DB_URI);

app.use(cors({
    origin: "https://devspace-frontend-9.onrender.com",
    credentials:true,
}));

const cookie=require('cookie-parser');



app.use(express.json());
app.use(cookie());
const server=http.createServer(app);
initializesocket(server);
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
server.listen(5000,()=>{
    console.log("server is running at port 5000");
});
})
.catch((err)=>{
console.log("failed to connect with database");
})
