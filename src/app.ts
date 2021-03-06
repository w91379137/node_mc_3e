
require('source-map-support').install();

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
import { PLCController } from './server/controller/rlc-controller';
import { PLCConnection } from './plc/PLCConnection';

// TEST     10.1.1.39 1026
// PLCv1    192.168.3.120 1025
// PLCv2_1  192.168.3.100 1025
// PLCv2_2  192.168.3.110 1025

const plc_host = '10.1.1.39';
const plc_port = 1026;

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

    GlobalUse.plc = new PLCConnection(plc_host, plc_port)

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
            new PLCController(),
        ],
        middlewares: [
            loggerMiddleware
        ],
    })

    server.start()
}

run()