import mongoose from 'mongoose';

const userCollection = 'users';

const userSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    age: Number,
    email: {
        type: String,
        unique: true,
        dropDups: true,
        required: true,
        index: true,
    },
    password: String,
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
        ref: 'carts',
    },
    role: {
        type: String,
    },
});

const userModel = mongoose.model(userCollection, userSchema);

export { userModel };

