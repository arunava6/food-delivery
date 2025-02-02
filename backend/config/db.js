import mongoose, { connect } from "mongoose";

export const connectDB = async() =>{
    await mongoose.connect('mongodb+srv://arunava6:767904@cluster0.iqrxf.mongodb.net/food-del').then(()=> console.log("MongoDB connected"));
}

