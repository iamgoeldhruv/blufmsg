import {z} from 'zod';

export const MessageSchema=z.object({
    content:z.string().min(1,"message cant be empty").max(300,"too long")
   
})