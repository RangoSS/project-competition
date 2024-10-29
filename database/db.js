import mongoose from "mongoose";

const connectToDB =async ()=>{
       await mongoose.connect(process.env.URI).then((res)=>{
        console.log("mongo connectet succesfuly")
       })
    
}
export default connectToDB;