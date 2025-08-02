const validator=require('validator');

const signupvalidation=(req)=>{
const {firstName,email,lastName}=req.body;
if(!firstName||!lastName){
    throw new Error("Name is not valid");
}
else if(!validator.isEmail(email)){
    throw new Error("Email ID is not valid");
}
}
module.exports={
    signupvalidation,
}