import mongoose, { model, Schema } from "mongoose";

const todoSchema = new Schema({
    text: { type: String, required: true },
    priority: { type: String, required: true },
    deadline: { type: String, required: true }
});

export const Todo = mongoose.models.Todo || model("Todo", todoSchema);

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    surname: { type: String, required: true },
    idNumber: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    photo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'photos', // Reference to the GridFS bucket
    }
});

export const User = mongoose.models.User || model("User", userSchema);
