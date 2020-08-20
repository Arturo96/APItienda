"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var server_1 = __importDefault(require("./server/server"));
var router_1 = __importDefault(require("./router/router"));
var port = Number(process.env.PORT) || 3000;
var server = server_1.default.init(port);
server.app.use(router_1.default);
server.start(function () { return console.log('Iniciando servidor en el puerto', port); });
