const Hospital = require('../MODELS/hospitalSchema');

const hospitalRequest = async(req,res)=>{
    try {
        const {name,owner, email, phone, address, wallet, verification} = req.body;
        if(!name || !email || !phone || !address || !wallet || !owner || !verification){
            res.json({message: "fields missing",status: false});
        }
        const existingHospital = await Hospital.findOne({email});
        if(existingHospital){
            res.json({message: "Hospital already exists",status: false});
        }
        const hashedPassword = await bcrypt.hash(email, 10);
        const hospital = new Hospital({
            name,owner, email,password: hashedPassword, phone, address, wallet, verification
        })
        const response = await hospital.save();
        res.json({message: "Hospital registered successfully",id:response._id,status: true});
    } catch (error) {
        res.json({message:"error accured in registering Hospital", status: false})
    }
}


module.exports = {hospitalRequest}