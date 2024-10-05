const Reception = require('../MODELS/receptionSchema');
const bcrypt = require('bcrypt')

const receptionLogin = async(req,res)=>{
    try {
        const {email, password} = req.body;
        const reception = await Reception.findOne({email});
        if(!reception){
            res.json({message:"Reception not found on database",status: true})
        }
        const isMatch = await bcrypt.compare(password, reception.password);
        if(!isMatch){
            res.json({message:"login failed",status:false})
        }
        res.json({message:"login successful",user:reception,status:true})
    } catch (error) {
        res.json({message:"error caught in loginReception",status: false})
    }
}

module.exports = {receptionLogin}