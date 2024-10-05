const Hospital = require('../MODELS/hospitalSchema');
const bcrypt = require('bcrypt')

const hospitalRequest = async(req,res)=>{
    try {
        const {name,owner, email, phone, address, wallet, verification} = req.body;
        if(!name || !email || !phone || !address || !wallet || !owner || !verification){
            throw new Error("fields missing");
           
        }
        const existingHospital = await Hospital.findOne({email});
        if(existingHospital){
            throw new Error("Hospital already exists");
            
        }
        const hashedPassword = await bcrypt.hash(email, 10);
        const hospital = new Hospital({
            name,owner, email,password: hashedPassword, phone, address, wallet, verification
        })
        const response = await hospital.save();
        res.json({message: "Hospital registered successfully",id:response._id,status: true});
    } catch (error) {
        console.log(error)
        res.status(400).json({message:"error accured in registering Hospital", status: false})
    }
}


module.exports = {hospitalRequest}