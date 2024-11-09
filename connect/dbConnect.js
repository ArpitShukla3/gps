import mongoose from'mongoose';
export default async function connectDB(){
  try {
    const conn = await mongoose.connect(process.env.Uri);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
};

