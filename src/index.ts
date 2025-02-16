import {
  createPortal,
  EtherMiddleware,
  MicroEnv,
  Middleware,
} from '@ceil-dev/portals';
import { createClient } from '@node-redis/client';

export * from '@ceil-dev/portals';

type RedisClient = ReturnType<typeof createClient>;

type RedisPortalProps = {
  pubClient: RedisClient;
  subClient: RedisClient;
  env: MicroEnv;
  middleware?: Middleware;
};

export const createRedisPortal = ({
  pubClient,
  subClient,
  env,
  middleware,
}: RedisPortalProps) => {
  const portal = createPortal(env, [
    createRedisEther({ pubClient, subClient }),
    middleware || {},
  ]);
  return portal;
};

export const createRedisEther = ({
  pubClient,
  subClient,
}: {
  pubClient: RedisPortalProps['pubClient'];
  subClient: RedisPortalProps['subClient'];
}): EtherMiddleware => {
  let isStarted = false;
  let handleMessage: (message: string) => void;

  return {
    'ether.attach': ({ id, portal }) => {
      if (isStarted) return;
      isStarted = true;
      handleMessage = (message) => {
        if (!isStarted) return;

        portal('receive', message);
      };
      subClient.subscribe(id, handleMessage);
    },
    'ether.detach': ({ id }) => {
      if (!isStarted) return;
      isStarted = false;
      subClient.unsubscribe(id, handleMessage);
    },
    'ether.send': async ({ payload }) => {
      if (!isStarted) return;

      const { payload: data, recipient } = payload || {};
      if (!recipient) {
        console.warn('redisPortal > dispatch: no recipient specified');
        return;
      }

      if (!(typeof data === 'string')) {
        console.warn('redisPortal > dispatch: payload must be of type string');
        return;
      }

      pubClient.publish(recipient, data);
    },
  };
};
