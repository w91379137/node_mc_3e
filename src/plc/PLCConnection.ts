
let debug = require('debug')('app:PLCConnection')
import * as net from "net";

export class PLCConnection {

    private client: net.Socket
    private resolve: (value?: Buffer | PromiseLike<Buffer>) => void

    // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====

    constructor(
        host: string, 
        port: number) {

        this.client = net.connect(port, host, () => {
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