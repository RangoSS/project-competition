import mongoose from "mongoose";

const connectToDB = async () => {
    const connectionParams = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // Add any other parameters you need, such as:
        // useCreateIndex: true, // if using an older version of Mongoose
        // useFindAndModify: false, // if needed
    };

    try {
        await mongoose.connect(process.env.URI, connectionParams);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection error:", error.message);
        throw error; // Optional: rethrow error for further handling
    }
};

export default connectToDB;
