import { type } from "@testing-library/user-event/dist/type";
import mongoose,{model, Schema} from "mongoose";
const todoShema = new Schema({
    text:{type:String,required:true},
    priority:{type:String,required:true},
    deadline:{type:String,required:true}
})

export const Todo =models.Todo || new model("Todo",todoShema)