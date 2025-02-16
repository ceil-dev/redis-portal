# Redis Portal Library

_Library for using Portals with Redis ether_

---

## Table of Contents

1. [Overview](#overview)
2. [Installation](#installation)
3. [Example](#example)
4. [License](#license)

---

## Overview

Connect multiple node processes via Redis with Portals

---

## Installation

```bash
npm install @ceil-dev/redis-portal
```

---

### Example

```typescript
import { createClient } from '@node-redis/client';
import { createRedisPortal, microEnv } from '@ceil-dev/redis-portal';

const run = async () => {
  // Assuming you have a redis server running on port 6379
  const port = 6379;

  const pubClient = createClient({
    url: 'redis://localhost:' + port, // Update with your Redis URL
  });
  pubClient.on('connect', () => {
    console.log('Connected to Redis (pub) on port', port);
  });
  pubClient.on('error', (err) => {
    console.error('Redis Client Error:', err);
  });
  pubClient.connect();

  const subClient = createClient({
    url: 'redis://localhost:' + port, // Update with your Redis URL
  });
  subClient.on('connect', () => {
    console.log('Connected to Redis (sub) on port', port);
  });
  subClient.on('error', (err) => {
    console.error('Redis Client Error:', err);
  });
  subClient.connect();

  const portal = createRedisPortal({
    pubClient,
    subClient,
    env: microEnv({ hello: 'world' }, { id: 'envA' }),
  });

  portal('open');

  // Now you can enter this portal "envA" from another local process
};

run().catch(console.error);
```

---

### License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
