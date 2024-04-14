import dbConnect from "@/lib/dbConnect"
import userModel from "@/models/User"
import bcryptjs from "bcryptjs"
import { sendverificationemail } from "@/helpers/sendVerificationEmail"
function generateVerificationCode(length:number) {
  let code = '';

  for (let i = 0; i < length; i++) {
    const randomChar = Math.floor(Math.random() * 10); // Generates a random number between 0 and 9
    code += randomChar;
  }

  return code;
}



export async function POST(request:Request){
    await dbConnect()
    try{
       
        const {username,email,password}=await request.json();
         const verifiedUser=await userModel.findOne({
            username,
            isVerified:true
        })
        if(verifiedUser){
            return(Response.json({
                success:false,
                message:"User already exist"
            },{
                status:400
            }))
        }
        const existUserByEmail=await userModel.findOne({email});
        const verificationCode = generateVerificationCode(6).toString();
        if(existUserByEmail){
            if(existUserByEmail.isVerified){
                return(Response.json({
                    success:false,
                    message:"User already exist"
                },{
                    status:400
                }))
            }
            else{
                const hashedPassword= await bcryptjs.hash(password,10);
                existUserByEmail.password=hashedPassword
                existUserByEmail.verifyCode=verificationCode
                existUserByEmail.verifyCodeExpiry=new Date(Date.now()+3600000);
                await existUserByEmail.save();
            }

        }
        else{
            const hashedPassword=await bcryptjs.hash(password,10)
            const expiryDate=new Date()
            expiryDate.setHours(expiryDate.getHours()+1)
            const newUser=new userModel({
                username,
                email,
                password:hashedPassword,
                verifyCode:verificationCode,
                verifyCodeExpiry:expiryDate,
                isVerified:false,
                isAcceptingMessage:true,
                
                messages:[]


            })
            await newUser.save();

        }
        const emailResponse=await sendverificationemail(email,username,verificationCode)
        if(!emailResponse.success){
            return(Response.json({
                success:false,
                message:emailResponse.message
            },{
                status:400
            }))

        }
        else{
            return(Response.json({
                success:true,
                message:"User registered please verify your email"
            },{
                status:500
            }))
        }


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