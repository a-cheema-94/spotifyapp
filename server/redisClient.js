import { createClient } from 'redis';

export const redisClient = createClient();

redisClient.on('connect', () => console.log('Connected to Redis'));
redisClient.on('ready', () => console.log('Redis Client ready to use'));
redisClient.on('error', err => console.log('Redis Client Error', err));
redisClient.on('end', () => console.log('Disconnected from Redis'));

