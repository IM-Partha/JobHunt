import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const conectDB = async ()=>{
    try{
        await mongoose.connect(process.env.MONGOURL_URL)
        console.log("mongoDb Connected")
    }
    catch(e){
        console.log("conection lost", e)
    }
}

export default conectDB