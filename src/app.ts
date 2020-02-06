
require('source-map-support').install();
const delay = require('delay');

let debug = require('debug')('app:main')

//====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====
// local 服務建立

import { GlobalUse } from './global-use';
import { storage } from './service/localstorage';
import { append } from './service/append';
import { log } from './service/log';
import { terminal } from './service/child';

//====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====
// server 屬性建立

import * as express from 'express';
import { Server } from './server/server';
import { RootController } from './server/controller/root-controller';
import { PLCConnection } from './plc/PLCConnection';
import { Command } from './plc/command';

async function run() {

    //====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====
    // local 服務建立
    GlobalUse.myStorage = storage
    // GlobalUse.myStorage.setItem('time', (new Date()).toString());
    // GlobalUse.myStorage.getItem('time'));

    GlobalUse.append = append
    // GlobalUse.append("data/data.txt", "test")

    GlobalUse.log = log
    // GlobalUse.log("test")

    let plc = new PLCConnection()
    await delay(1000)

    let cmd = Command.read(0x1000, 5)
    // let cmd = Command.write(0x1000,1)
    // let cmd = Command.write(0x1001,1)

    console.log('cmd', cmd)
    let res = await plc.send(cmd)
    console.log('res', res)
    let parseRes = Command.parseRes(res)
    console.log('parseRes', parseRes)

    //====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====
    // server 屬性建立

    // Middleware 中介軟體
    function loggerMiddleware(req: express.Request, res: express.Response, next) {
        debug(`Method:${req.method} Path:${req.path} Body:${JSON.stringify(req.body)}`)
        next();
    }

    const port = 5001
    let server = new Server({
        port: port,
        controllers: [
            new RootController(),
        ],
        middlewares: [
            loggerMiddleware
        ],
    })

    server.start()
}

run()