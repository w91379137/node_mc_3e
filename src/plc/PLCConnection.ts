
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
            this.try()
        })

        this.client.on('data', (data) => {
            console.log(data)
        })
    }

    // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====

    try() {
        let buffer = Command.write(0x1000, 0xFFFF)
        console.log(buffer, buffer.length, buffer.byteLength)
        this.client.write(buffer)
    }
}