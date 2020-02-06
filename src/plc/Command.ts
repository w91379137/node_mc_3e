


export namespace Command {

    // http://kilean.pixnet.net/blog/post/304348793-%E4%B8%89%E8%8F%B1-mc-protocol
    export function read(number: string = '000000'): Buffer {

        let hex =
            [
                '', // 標頭(Header)，E71模組會自動添加，因此這邊送碼不用加
                '5000', // 副標頭(Subheader)
                '00', // 網路編號(Network No.)
                'FF', // PC編號(PC No.)
                'FF03', // 請求目標模組I/O編號(Request destination module I/O No.) 
                '00', // 請求目標模組站號(Request destination module station No.)
                '0C00', // 請求資料長度(Request data length)
                '0100', // 監視計時器(Monitoring timer)
                '0104', // 指令(Command)
                '0000', // 子指令(Subcommand)
                number, // 暫存器位址(Device number)
                'B4', // 暫存器代碼(Device code) D A8 W B4
                '0100', // 暫存器數(Number of device points)
            ]

        let buffer = Buffer.from(hex.join(''), "hex")
        return buffer
    }

    export function write() {

    }
}