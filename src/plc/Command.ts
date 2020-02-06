


export namespace Command {

    // http://kilean.pixnet.net/blog/post/304348793-%E4%B8%89%E8%8F%B1-mc-protocol
    export function read(
        n: number = 0x0000
    ): Buffer {

        let part1 =
            [
                '', // 標頭(Header)，E71模組會自動添加，因此這邊送碼不用加
                '5000', // 副標頭(Subheader)
                '00', // 網路編號(Network No.)
                'FF', // PC編號(PC No.)
                'FF03', // 請求目標模組I/O編號(Request destination module I/O No.) 
                '00', // 請求目標模組站號(Request destination module station No.)
                '0C00', // 請求資料長度(Request data length) 在此之後的 byte 數目
                '0100', // 監視計時器(Monitoring timer)
                '0104', // 指令(Command)
                '0000', // 子指令(Subcommand)
            ]
        let b1 = Buffer.from(part1.join(''), "hex")

        let b2 = Buffer.alloc(3)
        b2.writeUInt16LE(n, 0)

        let part3 =
            [
                'B4', // 暫存器代碼(Device code) D A8 W B4
                '0100', // 暫存器數(Number of device points)
            ]
        let b3 = Buffer.from(part3.join(''), "hex")


        let buffer = Buffer.concat([b1, b2, b3])
        return buffer
    }

    export function write(
        n: number = 0x0000,
        value: number = 0,
    ) {

        let part1 =
        [
            '', // 標頭(Header)，E71模組會自動添加，因此這邊送碼不用加
            '5000', // 副標頭(Subheader)
            '00', // 網路編號(Network No.)
            'FF', // PC編號(PC No.)
            'FF03', // 請求目標模組I/O編號(Request destination module I/O No.) 
            '00', // 請求目標模組站號(Request destination module station No.)
            '0E00', // 請求資料長度(Request data length) 在此之後的 byte 數目
            '0100', // 監視計時器(Monitoring timer)
            '0114', // 指令(Command)
            '0000', // 子指令(Subcommand)
        ]
        let b1 = Buffer.from(part1.join(''), "hex")

        let b2 = Buffer.alloc(3)
        b2.writeUInt16LE(n, 0)

        let part3 =
            [
                'B4', // 暫存器代碼(Device code) D A8 W B4
                '0100', // 暫存器數(Number of device points)
            ]
        let b3 = Buffer.from(part3.join(''), "hex")

        let b4 = Buffer.alloc(2)
        b4.writeUInt16LE(value, 0)

        let buffer = Buffer.concat([b1, b2, b3, b4])
        return buffer
    }
}