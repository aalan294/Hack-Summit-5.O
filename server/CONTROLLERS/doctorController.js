const Doctor = require('../MODELS/doctorSchema');
const bcrypt = require('bcrypt')

const loginDoctor = async(req,res)=>{
    try {
        const {email, password} = req.body;
        const doctor = await Doctor.findOne({email});
        if(!doctor){
            res.json({message:"doctor not found on database",status: true})
        }
        const isMatch = await bcrypt.compare(password, doctor.password);
        if(!isMatch){
            res.json({message:"login failed",status:false})
        }
        res.json({message:"login successful",user:doctor,status:true})
    } catch (error) {
        res.json({message:"error caught in loginDoctor",status: false})
    }
}

module.exports = { loginDoctor}