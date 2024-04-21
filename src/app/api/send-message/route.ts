import dbConnect from "@/lib/dbConnect";
import { Message } from "@/models/User";
import userModel from "@/models/User";

export default async function POST(request:Request) {
    await dbConnect()
    const {username,message}=await request.json();
    try {
        const user=await userModel.findOne({username});
        if(!user){
            return Response.json({
                success:false,
                message:"user not found"
            },{
                status:404
            }
        )
        }
        if(!user.isAcceptingMessage){
            return Response.json({
                success:false,
                message:"user is not accepting messages"
            },{
                status:401
            }
        )
        }
        const newMessage={content:message,createdAt:new Date()}
         user.messages.push(newMessage as Message)
         await user.save();
         return Response.json({
            success:true,
            message:"messge sent succesfully"
        },{
            status:201
        }
    )



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