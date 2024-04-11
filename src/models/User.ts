import mongoose,{Schema,Document} from "mongoose"

export interface Message extends Document{
    content:string,
    createdAt:Date
}

const MessageSchema :Schema<Message>=new Schema({
    content:{
        type:String,
        reqired:true
    },
    createdAt:{
        type:Date,
        reqired:true,
        default:Date.now
    }
})

export interface User extends Document{
    username:string,
    email:string,
    password:string,
    verifyCode:string,
    verifyCodeExpiry:Date,
    isVerified:boolean,
    isAcceptingMessage:boolean,
    
    messages:Message[]

}

const UserSchema :Schema<User>=new Schema({
  username:{
    type:String,
    required:[true,"Please provide a username"],
    unique:true,
    trim:true,

  },
  email:{
    type:String,
    required:[true,"Please provide a email"],
    unique:true,
    match:[/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    ,"please enter valid email"]

  },
  password:{
    type:String,
    required:[true,"Please provide a password"],

  },
  verifyCode:{
    type:String,
    required:[true,"Please provide a verifycode"],

  },
  verifyCodeExpiry:{
    type:Date,
    required:[true,"Please provide a verifycodeexpiry"],

  },
  isVerified:{
    type:Boolean,
    default:false,

  },
  isAcceptingMessage:{
    type:Boolean,
    default:true,

  },
  messages:[MessageSchema]




})

const userModel=(mongoose.models.User as mongoose.Model<User>)|| mongoose.model<User>("User",UserSchema);
export default userModel;
