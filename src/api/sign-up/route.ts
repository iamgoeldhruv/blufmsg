import dbConnect from "@/lib/dbConnect"
import userModel from "@/models/User"
import bcryptjs from "bcryptjs"
import { sendverificationemail } from "@/helpers/sendVerificationEmail"


export async function POST(request:Request){
    await dbConnect()
    try{
        const {username,email,password}=await request.json();

    }catch(err){
        console.error(err);
        return Response.json({
            success:false,
            message:"error registering user",

        },{
            status:500
        })
    }

}