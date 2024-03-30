import mongoose from "mongoose"

import colors from "colors"

const connectDB=async () => {
    try{
        const conn=await mongoose.connect(process.env.MONGO_URL);
        console.log(`Connected sucessfully`)

    }catch(err){
        console.log(`Error in mongod ${err}`.bgMagenta.bgBlue)
    }
}
export default connectDB;