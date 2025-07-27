const mongoose=require('mongoose');
const connectDB=async()=>{
    await mongoose.connect(
        "mongodb+srv://ratnesh123raja:T7RVpaXdP9htPl2z@cluster0.vulbc6u.mongodb.net/devTinder"
    );
};
module.exports=connectDB;