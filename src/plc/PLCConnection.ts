
let debug = require('debug')('app:PLCConnection')
import * as net from "net";
import { Command } from "./command";

const Host = '10.1.1.39';
const Port = 1026;

export class PLCConnection {

    private client: net.Socket
    private resolve: (value?: Buffer | PromiseLike<Buffer>) => void

    // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====

    constructor() {

        this.client = net.connect(Port, Host, () => {
            debug('PLC connect')
        })

        this.client.on('data', (data) => {
            this.response(data)
        })
    }

    // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====

    // https://stackoverflow.com/questions/51488022/how-to-make-javascript-execution-wait-for-socket-on-function-response
    
    send(buffer, timeout = 1000): Promise<Buffer> {
        return new Promise((resolve, _) => {
            this.resolve = resolve
            this.client.write(buffer)
            // timeout
            setTimeout(() => {
                this.response(undefined)
            }, timeout)
        });
    }

    response(data) {
        if (this.resolve) {
            this.resolve(data)
            this.resolve = undefined
        }
    }
}