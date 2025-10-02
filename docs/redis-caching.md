# Redis Server-Side Caching Documentation

## Overview

Redis is an in-memory data structure store that can be used as a cache to improve the performance of your application. This document provides step-by-step instructions on how to set up Redis for this project and implement server-side caching.

---

## Why Use Redis?

- **Performance**: Redis is extremely fast as it stores data in memory.
- **Scalability**: Redis works well in distributed systems.
- **Persistence**: Redis can optionally persist data to disk.
- **Flexibility**: Supports various data structures like strings, hashes, lists, etc.

---

## Prerequisites

1. **Node.js Installed**: Ensure Node.js is installed on your system.
2. **Redis Installed**: Install Redis on your local machine or use a managed Redis service (e.g., AWS ElastiCache, Azure Cache for Redis, or Redis Cloud).

---

## Step 1: Install Redis

### Local Installation

- **MacOS**:
    ```bash
    brew install redis
    brew services start redis
    ```
- **Ubuntu**:
    ```bash
    sudo apt update
    sudo apt install redis-server
    sudo systemctl enable redis
    sudo systemctl start redis
    ```
- **Windows**:
  Download and install Redis from [here](https://github.com/microsoftarchive/redis/releases).

### Verify Installation

Run the following command to check if Redis is running:

```bash
redis-cli ping
```

You should see the response:

```
PONG
```

---

## Step 2: Install Redis Client Library

Install the `ioredis` library to interact with Redis in your Node.js application:

```bash
npm install ioredis
```

---

## Step 3: Configure Redis in the Project

### Import and Initialize Redis

In your API route or server file, import and configure Redis:

```typescript
import Redis from "ioredis";
const redis = new Redis(); // Defaults to localhost:6379
```

### Example Usage

#### Caching Data

```typescript
const cacheKey = "example_key";
const cachedData = await redis.get(cacheKey);

if (cachedData) {
	return JSON.parse(cachedData);
}

// Fetch data from the database or API
const data = { key: "value" };
await redis.set(cacheKey, JSON.stringify(data), "EX", 300); // Cache for 5 minutes
return data;
```

---

## Step 4: Implement Redis Caching in the Project

### Example: Group Metrics API

The following code demonstrates how Redis caching is implemented in the `group metrics` API:

```typescript
import Redis from "ioredis";

const redis = new Redis();
const CACHE_DURATION = 300; // Cache duration in seconds

export async function GET(req) {
	const groupId = req.query.groupId;
	const cacheKey = `group_metrics_${groupId}`;

	// Check Redis cache
	const cachedResponse = await redis.get(cacheKey);
	if (cachedResponse) {
		return JSON.parse(cachedResponse);
	}

	// Fetch data from Supabase
	const data = await fetchGroupMetricsFromDatabase(groupId);

	// Cache the response
	await redis.set(cacheKey, JSON.stringify(data), "EX", CACHE_DURATION);

	return data;
}
```

---

## Step 5: Testing Redis Caching

1. Start your Redis server:
    ```bash
    redis-server
    ```
2. Test the API endpoint and verify that data is cached by checking Redis:
    ```bash
    redis-cli
    GET group_metrics_<groupId>
    ```

---

## Step 6: Deploying with Redis

If deploying to a cloud provider:

1. Use a managed Redis service (e.g., AWS ElastiCache, Azure Cache for Redis).
2. Update the Redis connection string in your project to point to the managed Redis instance.
    ```typescript
    const redis = new Redis("redis://<username>:<password>@<host>:<port>");
    ```

---

## Best Practices

1. **Set Expiry Times**: Always set an expiry time (`EX`) for cached data to prevent stale data.
2. **Monitor Redis**: Use tools like RedisInsight to monitor and manage your Redis instance.
3. **Handle Failures Gracefully**: Ensure your application can handle Redis connection failures.

---

## Additional Resources

- [Redis Documentation](https://redis.io/docs/)
- [ioredis GitHub](https://github.com/luin/ioredis)
- [Supabase Documentation](https://supabase.com/docs)
