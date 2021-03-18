const User = require("../models/user");
const jwt = require("jsonwebtoken");

const auth = async (req,res,next)=>{
    try{
        const token = req.get('Authorization').replace('Bearer ','');
        const _id = await jwt.verify(token,process.env.JWT_SECRET);
        const user = await User.findOne({_id,'tokens.token':token});
        if(!user){
            throw new Error();
        }
        req.token = token;
        req.user = user;
        next();
    }catch(e){
        res.status(401).send({error:"please authorize"});
    }
    
}

module.exports = auth;