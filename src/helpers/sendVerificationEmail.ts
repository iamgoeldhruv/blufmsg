import {resend} from "@/lib/resend";
import VerificationEmail from "../../emails/sendverificationemail"
import { apiResponse } from "@/types/apiResponse";

export async function sendverificationemail(
    email:string,
    username:string,
    verifyCode:string):Promise<apiResponse>{
        try{
            await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'Bluf msg verification code',
            react: VerificationEmail({username,otp:verifyCode}),
  });

            return{
                success:true,
                message:"verification email send successfully",
            }

        }catch(err){
            console.log(err);
            return{
                success:false,
                message:"error sending verification email",
            }

        }
    }


