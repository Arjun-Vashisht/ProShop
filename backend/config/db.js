import mongoose from "mongoose";

const connectDB = async () => {
    console.log(process.env.MONGO_URI)
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
        })

        console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
    } catch (error) {
        console.error(`ERROR: ${error.message}`.red.underline.bold)
        process.exit(1)
    }
}

export default connectDB