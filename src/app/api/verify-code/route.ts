import dbConnect from "@/lib/dbConnect";
import userModel from "@/models/User";

export async function POST(request:Request){
    dbConnect()
    try {
        const {username,code}=await request.json();
        const user =await userModel.findOne({username});
        if(!user){
            return Response.json({
                success: false,
                message:"user not found"
            },{
                status:400
            })
        }
        else{
            const isVerifyCodeCorrect= user.verifyCode===code;
            const isNotExpired=new Date(user.verifyCodeExpiry)>=new Date();

            if(isVerifyCodeCorrect && isNotExpired){
                user.isVerified=true;
                await user.save();
                return Response.json({
                    success: true,
                    message:"user verifed succesfully"
                },{
                    status:200
                })

            }
            else if(!isNotExpired){
                return Response.json({
                    success: false,
                    message:"verify code expired"
                },{
                    status:400
                })

            }
            else{
                return Response.json({
                    success: false,
                    message:"incorrect code"
                },{
                    status:400
                })
            }

        }

        
    } catch (error) {
        console.log("error checking verify code",error)
        return Response.json({
            success:false,
            message:"error checking verify code"

        },{
            status:400
        })
        
    }
}