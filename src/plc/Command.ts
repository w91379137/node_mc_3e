
const MC_Frame_3E_Header =
    [
        '', // 標頭(Header)，E71模組會自動添加，因此這邊送碼不用加
        '5000', // 副標頭(Subheader)
        '00', // 網路編號(Network No.)
        'FF', // PC編號(PC No.)
        'FF03', // 請求目標模組I/O編號(Request destination module I/O No.) 
        '00', // 請求目標模組站號(Request destination module station No.)
    ]

const headerBuffer = Buffer.from(MC_Frame_3E_Header.join(''), "hex")

export namespace Command {

    // http://kilean.pixnet.net/blog/post/304348793-%E4%B8%89%E8%8F%B1-mc-protocol
    export function read(
        n: number = 0x0000,
        points: number = 1
    ): Buffer {

        let command =
            [
                '0C00', // 請求資料長度(Request data length) 在此之後的 byte 數目
                '0100', // 監視計時器(Monitoring timer)
                '0104', // 指令(Command)
                '0000', // 子指令(Subcommand)
            ]
        let commandBuffer = Buffer.from(command.join(''), "hex")

        let deviceNumberBuffer = Buffer.alloc(3)
        deviceNumberBuffer.writeUInt16LE(n, 0) // 暫存器位址(Device number)

        let deviceCode =
            [
                'B4', // 暫存器代碼(Device code) D A8 / W B4
            ]
        let deviceCodeBuffer = Buffer.from(deviceCode.join(''), "hex")

        let devicePointsBuffer = Buffer.alloc(2)
        devicePointsBuffer.writeUInt16LE(points, 0) // 暫存器數(Number of device points)

        let buffer = Buffer.concat(
            [
                headerBuffer,
                commandBuffer,
                deviceNumberBuffer,
                deviceCodeBuffer,
                devicePointsBuffer,
            ])
        return buffer
    }

    export function write(
        n: number = 0x0000,
        values: number[] = [],
    ) {
        let length = 0xC + values.length * 2
        console.log(length)
        let lengthBuffer = Buffer.alloc(2) // 請求資料長度(Request data length) 在此之後的 byte 數目  要扣掉前面 9格
        lengthBuffer.writeUInt16LE(length, 0)

        let command =
            [
                '0100', // 監視計時器(Monitoring timer)
                '0114', // 指令(Command)
                '0000', // 子指令(Subcommand)
            ]
        let commandBuffer = Buffer.from(command.join(''), "hex")

        let deviceNumberBuffer = Buffer.alloc(3)
        deviceNumberBuffer.writeUInt16LE(n, 0)  // 暫存器位址(Device number)

        let deviceCode =
            [
                'B4', // 暫存器代碼(Device code) D A8 / W B4
            ]
        let deviceCodeBuffer = Buffer.from(deviceCode.join(''), "hex")

        let devicePointsBuffer = Buffer.alloc(2) // 暫存器數(Number of device points)
        devicePointsBuffer.writeUInt16LE(values.length, 0)

        let valueBuffers = values.map(value => {
            console.log(value)
            let b = Buffer.alloc(2)
            b.writeUInt16LE(value, 0)
            return b
        })
        let data = Buffer.concat(valueBuffers)

        let buffer = Buffer.concat(
            [
                headerBuffer,
                lengthBuffer,
                commandBuffer,
                deviceNumberBuffer,
                deviceCodeBuffer,
                devicePointsBuffer,
                data,
            ])
        return buffer
    }

    export function parseRes(buffer: Buffer) {

        let length = buffer.slice(7, 9).readUInt16LE(0)
        // 長度之後 還有 00 00
        length -= 2

        let amount = length / 2

        let result: number[] = []
        for (let index = 0; index < amount; index++) {
            let int = buffer.slice(11 + index * 2, 13 + index * 2).readUInt16LE(0)
            result.push(int)
        }
        return result
    }
}