import { getServerSession } from "next-auth";
import { AuthOptions } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import userModel from "@/models/User";
import { User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";

export async function GET(request:Request){
    await dbConnect();
    const session=await getServerSession(authOptions);
    const user=session?.user

    if(!user){
        return Response.json({
            success:false,
            message:"Not authenticated"
        },{
        status:500
        }
    )

    }
    const userId=new mongoose.Types.ObjectId(user._id);
    try {
        const user=await userModel.aggregate([
            {$match:{id:userId}},
            {$unwind:'messages'},
            {$sort:{'messages.createdAt':-1}},
            {$group:{_id:'$_id',messages:{$push:'$messages'}}}
        ])
        if(!user || user.length==0){
            return Response.json({
                success:false,
                message:"user not found"
            },{
            status:500
            })

        }
        return Response.json({
            success:true,
            messages:user[0].messages
        },{
        status:200
        })
        
    } catch (error) {
        console.log(error);
        return Response.json({
            success:true,
            message:"server error"
        },{
            status:500
        })
        
    }

}