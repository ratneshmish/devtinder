const mongoose=require('mongoose');
const validator=require('validator');
const jwt=require('jsonwebtoken');
const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        require:true,
        minLength:4,
        maxLength:20,
        
    },
    lastName:{
        type:String,
        maxLength:20,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid emailid");
            }
        },
    },
    age:{
        type:Number,
        min:18,
        max:70,
    },
    password:{
        type:String,
        required:true,
    },
    gender:{
        type:String,
  
        validate(value){
            if(!["male","female","others"].includes(value)){
                throw new Error("Gender data is not valid");
            }
        }
    },
    about:{
        type:String,
        default:"this is default info"
    },
    skills:{
        type:[String],
        validate:{
            validator:function(val){
                return val.length<=5;
            },
            message:"You can add a maximum of 5 skills"
        }
    },
     photoUrl: {
        type: String,
        default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5yTxBxqX7UPLILheEuZbgOuYver2PQLQxuQ&s",
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error("Invalid photo URL");
            }
        }
    }
},{
    timestamps:true
});
userSchema.methods.getjwt= async function(){
    const user=this;
    const token= await jwt.sign({_id:user._id},process.env.SECRET_KEY,{
            expiresIn:"7d"
        });
        return token;
}
module.exports=mongoose.model("user",userSchema);