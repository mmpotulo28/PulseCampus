import Redis from "ioredis";
const redis = new Redis({
	db: 0,
	username: "default",
	password: "yasAXIKPzNB96PNfzWhWYaA4zsJAn913",
	host: "redis-15253.c73.us-east-1-2.ec2.redns.redis-cloud.com",
	port: 15253,
}); // Defaults to localhost:6379

export default redis;
