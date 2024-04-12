import mongoose from "mongoose"

type connectObject={
    isConnected?:Number;
}

const connection:connectObject={}

async function dbConnect():Promise<void>{
    if(connection.isConnected){
        console.log("Alrady connected")
        return;
    }
    try{
        const db=await mongoose.connect(process.env.MONGO_URI||" ");
        connection.isConnected=db.connections[0].readyState;
        console.log("Connected Successfully")

    }catch(error){
        console.log(error);
        process.exit(1);

    }
}
