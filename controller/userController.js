
//import {Todo,User} from "../models/todo_models.js"
import { Todo, User,Recipe } from "../models/todo_models.js";
import bcrypt from 'bcrypt';

export const getTodo= async(req, res) => {
    try{
        const result =await Todo.find()
        console.log()
        res.send({
            success:true,
            message:"Todo List Retrieved Successfuly",
            data:result
        });
    }catch(error){
        res.send({
            success:false,
            message:"unable to retrieve Todo list data",
            data:result
        });
    }
   
};
//todo api
export const createTodo= async(req,res)=>{
    const todoDetails =req.body
  try{
const result= await Todo.create(todoDetails)
res.send({
    success:true,
    message:"Todo is created successfully"
})
  }catch(error){
    console.log(error);
    res.send({
        success:false,
        message:" Todo is  unsuccessfully"
    })
  }
}

// Endpoint for creating a user with a photo
export const postUser = async (req, res) => {
    const { name, surname, idNumber, email, password, role } = req.body;
    
       // Log req.file to check if the file is uploaded correctly
    console.log("File received:", req.file);
    // Convert uploaded file to base64
    let photo = null;
    if (req.file) {
        const buffer = req.file.buffer; // Get the buffer from req.file
        photo = buffer.toString('base64'); // Convert the buffer to a base64 string
    }
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const userDetails = { name, surname, idNumber, email, password: hashedPassword, role, photo };
        
        // Create a new user in the database
        const result = await User.create(userDetails);
        console.log("User Details:", userDetails);
        
        res.send({
            success: true,
            message: "User created successfully",
            data: result
        });
    } catch (error) {
        console.error(error);
        res.status(400).send({
            success: false,
            message: "User creation failed",
            error: error.message
        });
    }
};
//get users data
export const getUser= async(req, res) => {
    try{
        const result =await User.find()
        console.log()
        res.send({
            success:true,
            message:"User Retrieved Successfuly",
            data:result
        });
    }catch(error){
        res.send({
            success:false,
            message:"unable to retrieve user list data",
            data:result
        });
    }
   
};

//recipe 
// Endpoint for creating a recipe
export const postRecipe = async (req, res) => {
    try {
        const { name, ingredients, instructions, category, preparationTime, cookingTime, servings } = req.body;

        // Log the received recipe data to check if everything is uploaded correctly
        console.log("Received recipe data:", { name, ingredients, instructions, category, preparationTime, cookingTime, servings });

        // Validate the required fields
        if (!name || !ingredients || !instructions || !category || !preparationTime || !cookingTime || !servings) {
            return res.status(400).send({
                success: false,
                message: "All fields are required"
            });
        }

        // Prepare recipe details
        const recipeDetails = {
            name,
            ingredients,
            instructions,
            category,
            preparationTime,
            cookingTime,
            servings
        };

        // Create a new recipe in the database
        const result = await Recipe.create(recipeDetails);
        console.log("Recipe Details:", recipeDetails);
        
        res.send({
            success: true,
            message: "Recipe created successfully",
            data: result
        });
    } catch (error) {
        console.error(error);
        res.status(400).send({
            success: false,
            message: "Recipe creation failed",
            error: error.message
        });
    }
};

{/*  
const bucket = new GridFSBucket(mongoose.connection.db, {
    bucketName: 'photos' // Use the same bucket name as in upload
});

// Route to get the image by filename
app.get('/images/:filename', (req, res) => {
    bucket.find({ filename: req.params.filename }).toArray((err, files) => {
        if (!files || files.length === 0) {
            return res.status(404).send('No files found');
        }
        const readStream = bucket.openDownloadStreamByName(req.params.filename);
        readStream.pipe(res);
    });
});
*/}