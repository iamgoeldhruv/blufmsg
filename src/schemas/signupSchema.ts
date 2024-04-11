import {z} from 'zod'

export const usernameVerificationSchema=z.string()
            .min(5,"username must bt 5 char long")
            .max(100,"username must be 100 char long")
            .regex(/^[a-zA-Z0-9._-]{3,16}$/,"username should not contain special charcters");
export const emailVerificationSchema=z.string().email({message:"Enter correct email"});

export const passwordVerifivationSchema=z.string().min(6,"passowrd must be atleast 6 char long");

export const signupSchema=z.object({
    username:usernameVerificationSchema,
    email:emailVerificationSchema,
    password:passwordVerifivationSchema,

})





