const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Task = require('./task');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name:{
        type:String,
        required:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)){
                 throw new Error("invalid email!");
            }
        }
    },
    password:{
        type:String,
        required:true,
        minLength:6,
        trim:true,
        validate(value){
            if(value ==='password'){
                throw new Error("Password can't be password");
            }
        }
    },
    age:{
        type:Number,
        default:0,
        validate(value){
            if(value<0){
                throw new Error ("age is invalid!");
            }
        }
    },
    avatar:{
        type:Buffer
    }
    ,
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
},{
    timestamps:true
});

userSchema.virtual('tasks',{
    ref:"Task",
    localField:'_id',
    foreignField:'owner'
});

//Including Virtuals to the output
userSchema.set('toObject', { virtuals: true });
userSchema.set('toJSON', { virtuals: true });



//Hashing the plain text password
userSchema.pre('save',async function (next){

    const user = this;
    console.log("Hello from middleware");
    if(user.isModified('password')){
        const hashPassword = await bcrypt.hash(user.password,8);
        user.password = hashPassword;
    }
    next();
});

//Cascade delete Tasks
userSchema.pre('remove',async function(next){
    const user = this;
    await Task.deleteMany({owner:user._id});
    next();
})

//Adding a static function to User model to login the user
userSchema.statics.findByCredentials = async function (email,password){

    
    const user = await User.findOne({email});
    
    if(!user){
        throw new Error("Unable to login");
    }
    const isValid = await bcrypt.compare(password,user.password);
    if(!isValid){
        throw new Error("unable to login");
    }
    return user;
}

//Hiding the private data before sending data to client
userSchema.methods.toJSON = function(){
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.tokens;
    return userObject;
}


//Generating and saving jason web tokken (jwt) for user
userSchema.methods.generateAuthToken = async function (){
 
    const user = this;
    const _id = user._id.toString();
    const token = jwt.sign(_id,process.env.JWT_SECRET);
    user.tokens.push({token:token});
    console.log(user);
    await user.save();
    return token;
}


//Defining the User Model
const User = mongoose.model('User',userSchema);


module.exports = User;