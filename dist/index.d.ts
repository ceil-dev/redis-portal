import { EtherMiddleware, MicroEnv, Middleware } from '@ceil-dev/portals';
import { createClient } from '@node-redis/client';
export * from '@ceil-dev/portals';
type RedisClient = ReturnType<typeof createClient>;
type RedisPortalProps = {
    pubClient: RedisClient;
    subClient: RedisClient;
    env: MicroEnv;
    middleware?: Middleware;
};
export declare const createRedisPortal: ({ pubClient, subClient, env, middleware, }: RedisPortalProps) => import("@ceil-dev/portals").PortalMethod;
export declare const createRedisEther: ({ pubClient, subClient, }: {
    pubClient: RedisPortalProps['pubClient'];
    subClient: RedisPortalProps['subClient'];
}) => EtherMiddleware;
