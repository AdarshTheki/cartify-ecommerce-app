import { createClient } from 'redis';

export const redisClient = createClient();

redisClient.on('error', (err) => console.log('Redis Error', err));

await redisClient.connect();
