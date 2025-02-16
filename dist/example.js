"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@node-redis/client");
const _1 = require(".");
const run = () => __awaiter(void 0, void 0, void 0, function* () {
    const port = 6379;
    const pubClient = (0, client_1.createClient)({
        url: 'redis://localhost:' + port,
    });
    pubClient.on('connect', () => {
        console.log('Connected to Redis (pub) on port', port);
    });
    pubClient.on('error', (err) => {
        console.error('Redis Client Error:', err);
    });
    pubClient.connect();
    const subClient = (0, client_1.createClient)({
        url: 'redis://localhost:' + port,
    });
    subClient.on('connect', () => {
        console.log('Connected to Redis (sub) on port', port);
    });
    subClient.on('error', (err) => {
        console.error('Redis Client Error:', err);
    });
    subClient.connect();
    const portal = (0, _1.createRedisPortal)({
        pubClient,
        subClient,
        env: (0, _1.microEnv)({ hello: 'world' }, { id: 'envA' }),
    });
    portal('open');
});
run().catch(console.error);
//# sourceMappingURL=example.js.map