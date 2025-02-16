"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
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
exports.createRedisEther = exports.createRedisPortal = void 0;
const portals_1 = require("@ceil-dev/portals");
__exportStar(require("@ceil-dev/portals"), exports);
const createRedisPortal = ({ pubClient, subClient, env, middleware, }) => {
    const portal = (0, portals_1.createPortal)(env, [
        (0, exports.createRedisEther)({ pubClient, subClient }),
        middleware || {},
    ]);
    return portal;
};
exports.createRedisPortal = createRedisPortal;
const createRedisEther = ({ pubClient, subClient, }) => {
    let isStarted = false;
    let handleMessage;
    return {
        'ether.attach': ({ id, portal }) => {
            if (isStarted)
                return;
            isStarted = true;
            handleMessage = (message) => {
                if (!isStarted)
                    return;
                portal('receive', message);
            };
            subClient.subscribe(id, handleMessage);
        },
        'ether.detach': ({ id }) => {
            if (!isStarted)
                return;
            isStarted = false;
            subClient.unsubscribe(id, handleMessage);
        },
        'ether.send': ({ payload }) => __awaiter(void 0, void 0, void 0, function* () {
            if (!isStarted)
                return;
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
        }),
    };
};
exports.createRedisEther = createRedisEther;
//# sourceMappingURL=index.js.map