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
    photo: {type: String }
    
});

export const User = mongoose.models.User || model("User", userSchema);

// Recipe Schema
const recipeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    ingredients: { type: String, required: true },
    instructions: { type: String, required: true },
    category: { type: String, required: true },
    preparationTime: { type: Number, required: true },  // Changed to Number
    cookingTime: { type: Number, required: true },      // Changed to Number
    servings: { type: Number, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to User
    createdAt: { type: Date, default: Date.now } // Optional: Track creation date
});

export const Recipe = mongoose.models.Recipe || model("Recipe", recipeSchema);
