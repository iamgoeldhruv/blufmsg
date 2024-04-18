import dbConnect from "@/lib/dbConnect";
import userModel from "@/models/User";
import { usernameVerificationSchema } from "@/schemas/signupSchema";
import {z}  from "zod";
// import { GET } from "../auth/[...nextauth]/route";
const usernameQuerySchema=z.object({
    username:usernameVerificationSchema
})
export async function GET(request:Request){
    await dbConnect()
    try {
        const {searchParams}=new URL(request.url);
        const queryParam={
            username:searchParams.get('username')

        }
        const check=usernameQuerySchema.safeParse(queryParam)
        if(!check.success){
            const usernameErrors=check.error.format().username?._errors || [];
            return Response.json({
                success:false,
                message:"invalid querty parametere"


            },{
                status:400
            })
        }
        const {username}=check.data;
        const isVerifedUser=await userModel.findOne({username,isVerified:true})
        if(isVerifedUser){
            return Response.json({
                success: false,
                message:"username already taken"
            },{
                status:400
            })
        }
        else{
            return Response.json({
                success: false,
                message:"username already taken"
            },{
                status:400
            })
        }

        


        
    } catch (error) {
        console.log("error checking username",error)
        return Response.json({
            success:false,
            message:"error checking username"

        },{
            status:400
        })
        
    }

}
