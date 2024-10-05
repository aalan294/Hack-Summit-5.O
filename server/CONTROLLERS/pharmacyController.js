const Pharmacy = require('../MODELS/pharmacySchema');
const bcrypt = require('bcrypt')


const pharmLogin = async(req,res)=>{
    try {
        const {email, password} = req.body;
        const pharmacy = await Pharmacy.findOne({email});
        if(!pharmacy){
            res.json({message:"Pharmacy not found on database",status: true})
        }
        const isMatch = await bcrypt.compare(password, pharmacy.password);
        if(!isMatch){
            res.json({message:"login failed",status:false})
        }
        res.json({message:"login successful",user:pharmacy,status:true})
    } catch (error) {
        res.json({message:"error caught in loginPharmacy",status: false})
    }
}

module.exports = {pharmLogin}
