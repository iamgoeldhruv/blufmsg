import { NextAuthOptions } from "next-auth";
import  CredentialsProvider  from "next-auth/providers/credentials";
import bcryptjs from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import userModel from "@/models/User";

export const authOptions:NextAuthOptions={
    providers:[
        CredentialsProvider({
            id: "Credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text", },
                password: { label: "Password", type: "password" }
              },
              async authorize(credentials:any):Promise<any>{
                await dbConnect()
                try {
                    const User=await userModel.findOne({
                        $or:[
                            {email:credentials.identifier},
                            {username:credentials.identifier}
                        ]
                    })
                    if(!User){
                        throw new Error("No such user exist")

                    }
                    if(!User.isVerified){
                        throw new Error("Please verify yor account first")
                    }
                    const checkPassword=await bcryptjs.compare(credentials.password,User.password)
                    if(!checkPassword){
                        throw new Error("icorrect password")
                    }
                    else{
                        return User
                    }
                } catch (error:any) {
                    throw new Error(error)
                    
                }

              }
        })
    ],
    callbacks:{
       
        async jwt({ token, user }) {
            if(user){
                token._id=user._id?.toString();
                token.isVerified=user.isVerified;
                token.isAcceptingMessage=user.isAcceptingMessage;
                token.username=user.username;
            }
            return token
        },
        async session({ session, token }) {
            if(token){
                session.user._id=token._id;
                session.user.isVerified=token.isVerified;
                session.user.isAcceptingMessage=token.isAcceptingMessage;
                session.user.username=token.username;
                
                


            }
            return session
          },

    },
    pages:{
        signIn:'/sign-in'
    },
    session:{
        strategy:'jwt'
    },
    secret:process.env.NEXT_AUTH_SECRET_KEY

}