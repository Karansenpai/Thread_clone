import mongoose from "mongoose";


const connectDb = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI || '');

        console.log(`MongoDB connected: ${conn.connection.host}`);

    }
    catch(error: unknown){
        console.error(`Error: ${(error as Error).message}`);
        process.exit(1);

    }
};

export default connectDb;