import Redis from "ioredis";
const redis = new Redis({
	db: 0,
	username: process.env.REDIS_USERNAME || "",
	password: process.env.REDIS_PASSWORD || "",
	host: process.env.REDIS_HOST || "",
	port: Number(process.env.REDIS_PORT) || 6379,
}); // Defaults to localhost:6379

export default redis;
