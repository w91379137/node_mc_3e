
let debug = require('debug')('app:PLCConnection')
import * as net from "net";
import { Command } from "./command";

const Host = '10.1.1.39';
const Port = 1026;

export class PLCConnection {

    client: net.Socket

    // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====

    constructor() {

        this.client = net.connect(Port, Host, () => {
            debug('PLC connect')
            this.read()
        })

        this.client.on('data', (data) => {
            console.log(data)
        })
    }

    // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====

    read() {
        let buffer = Command.read()
        console.log(buffer)
        this.client.write(buffer)
    }
}