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
const validateprofiledata=(req)=>{
const allowedupdates=[
    'firstName',
    'lastName',
    'about',
    'skills',
    'age',
]
 const isvalid=Object.keys(req.body).every((k)=>allowedupdates.includes(k));
 return isvalid;
}
module.exports={
    signupvalidation,
    validateprofiledata
}