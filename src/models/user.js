const mongoose=require('mongoose');
const validator=require('validator');
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
    }
},{
    timestamps:true
});
module.exports=mongoose.model("user",userSchema);