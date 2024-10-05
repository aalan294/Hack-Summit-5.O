const Doctor = require('../MODELS/doctorSchema');
const Pharmacy = require('../MODELS/pharmacySchema');
const Reception = require('../MODELS/receptionSchema');
const bcrypt = require('bcrypt')

const registerDoctor = async (req, res) => {
    try {
        const { name, email, phone, address, wallet, hospital, verification, dept } = req.body;

        // Check for missing fields
        if (!name || !email || !phone || !address || !wallet || !hospital || !verification || !dept) {
            return res.json({ message: "fields missing", status: false });
        }

        // Check if the doctor already exists
        const existingDoctor = await Doctor.findOne({ email });
        if (existingDoctor) {
            return res.json({ message: "Doctor already exists", status: false });
        }

        // Hash the password and create a new doctor
        const hashedPassword = await bcrypt.hash(email, 10);
        const doctor = new Doctor({
            name, email, password: hashedPassword, phone, address, wallet, hospital, verification, dept
        });

        // Save the doctor to the database
        const response = await doctor.save();
        return res.json({ message: "Doctor registered successfully", id: response._id, status: true });

    } catch (error) {
        console.log(error.message);
        return res.json({ message: "error occurred in registering Doctor", status: false });
    }
};


const registerReception = async(req,res)=>{
    try {
        const {name, email, phone, wallet, hospital, verification} = req.body;
        if(!name || !email || !phone || !wallet || !hospital || !verification){
            res.json({message: "fields missing",status: false});
        }
        const existingReception = await Reception.findOne({email});
        if(existingReception){
            res.json({message: "Receptionist already exists",status: false});
        }
        const hashedPassword = await bcrypt.hash(email, 10);
        const reception = new Reception({
            name, email, password: hashedPassword, phone, wallet, hospital, verification
        })
        const response = await reception.save();
        res.json({message: "Receptionist registered successfully",id:response._id,status: true});
    } catch (error) {
        console.log(error.message)
        res.json({message:"error accured in registering Doctor", status: false})
    }
}

const registerPharmacy = async(req,res)=>{
    try {
        const {name,owner, email, phone, address, wallet, verification} = req.body;
        if(!name || !email || !phone || !address || !wallet || !owner || !verification){
            res.json({message: "fields missing",status: false});
        }
        const existingPharmacy = await Pharmacy.findOne({email});
        if(existingPharmacy){
            res.json({message: "Pharmacy already exists",status: false});
        }
        const hashedPassword = await bcrypt.hash(email, 10);
        const pharmacy = new Pharmacy({
            name,owner, email,password: hashedPassword, phone, address, wallet, verification
        })
        const response = await pharmacy.save();
        res.json({message: "pharmacy registered successfully",id:response._id,status: true});
    } catch (error) {
        res.json({message:"error accured in registering pharmacy", status: false})
    }
}

const getPharamacies = async(req,res)=>{
    try {
        const pharamacies = await Pharmacy.find();
        res.json({message:"data fetched Successfully",pharmacies:pharamacies,status:true})
    } catch (error) {
        res.json({message:"error accured in getPharmacy",status: false})
    }

}

const getDoctors = async(req,res)=>{
    try {
        const doctors = await Doctor.find();
        res.json({message:"data fetched Successfully",doctors:doctors,status:true})
    } catch (error) {
        res.json({message:"error accured in getDoctors",status: false})
    }

}
const getReceptions = async(req,res)=>{
    try {
        const reception = await Reception.find();
        res.json({message:"data fetched Successfully",receptions:reception,status:true})
    } catch (error) {
        res.json({message:"error accured in getReceptions",status: false})
    }

}

module.exports = {getDoctors,getPharamacies,getReceptions,registerDoctor,registerPharmacy,registerReception}

