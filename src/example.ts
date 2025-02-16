import { createClient } from '@node-redis/client';
import { createRedisPortal, microEnv } from '.';

const run = async () => {
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
};

run().catch(console.error);
