import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    email: String,
    password: String,
    role: String,
    googleId: String, 
    name: String,     
    picture: String  
})

const UserModel = mongoose.model("users", UserSchema)

export default UserModel;