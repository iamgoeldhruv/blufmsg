import { getServerSession } from "next-auth";
import { AuthOptions } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import userModel from "@/models/User";
import { User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(request:Request){
    await dbConnect()
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
    const userId=user._id
    const {AcceptingMessage}=await request.json();
    try {
        const user1 =await userModel.findById(userId);
        if(!user1){
            return Response.json({
                success:false,
                message:"user not found"
            },{
            status:500
            }
        )
       
        }
        else{
            user1.isAcceptingMessage=AcceptingMessage;
            await user1.save()
            return Response.json({
                success:true,
                message:"saved"
            },{
            status:500
            }
        )
            
        }

        
    } catch (error) {
        return Response.json({
            success:false,
            message:"error updating accting flag"
        },{
        status:500
        }
    )
        
        
        
    }



}
export async function GET(request:Request){
    await dbConnect()
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
const userid=user._id;
try{

    const user2=await userModel.findById(userid);
    if(!user2){
        return Response.json({
            success:false,
            message:"user not found"
        },{
        status:500
        })

    }
    return Response.json({
        success:false,
        isAcceptingMessages:user2.isAcceptingMessage
    },{
        status:200
    })

}catch(err){
    return Response.json({
        success:false,
        message:err
    },{
    status:500
    })

}

}