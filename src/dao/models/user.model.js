import mongoose from 'mongoose';

const userCollection = 'users';

const userSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    age: Number,
    email: String,
    password: String,
});

const userModel = mongoose.model(userCollection, userSchema);

export { userModel };