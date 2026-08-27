import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error(
        'MONGODB_URI environment variable is not set. ' +
        'Please set it in your .env file with a valid MongoDB connection string. ' +
        'Example: mongodb+srv://username:password@cluster.mongodb.net/database-name'
      );
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      minPoolSize: 2,
      socketTimeoutMS: 45000,
      serverSelectionTimeoutMS: 5000,
      retryWrites: true,
    });
    
    console.log(`✓ MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    let errorMsg = error.message;
    
    if (error.message.includes('ENOTFOUND')) {
      errorMsg = 'MongoDB cluster not found. Check your connection string hostname.';
    } else if (error.message.includes('ECONNREFUSED')) {
      errorMsg = 'Connection refused. Ensure MongoDB cluster is running and accessible.';
    } else if (error.message.includes('authentication failed')) {
      errorMsg = 'MongoDB authentication failed. Verify your username and password in the connection string.';
    } else if (error.message.includes('not authorized')) {
      errorMsg = 'Database authorization failed. Ensure the MongoDB user has access to this database.';
    } else if (error.message.includes('bad auth')) {
      errorMsg = 'Invalid MongoDB credentials. Check username and password in MONGODB_URI.';
    }

    console.error(`✗ Error connecting to MongoDB: ${errorMsg}`);
    process.exit(1);
  }
};

export default connectDB;
