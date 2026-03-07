import mongoose from 'mongoose';
import { logger } from '../middlewares/logger.middleware.js';

async function connectDB() {
  try {
    const { connection } = await mongoose.connect(process.env.MONGODB_URI);
    const { host, name } = connection;
    logger.info(`MongoDb On >> ${host} - ${name}`);
  } catch (error) {
    logger.error(`MongoDb Failed On >> ${error.message}`);
    process.exit(1);
  }
}

export { connectDB };
