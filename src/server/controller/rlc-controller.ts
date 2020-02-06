const express = require('express');
let debug = require('debug')('app:rlc-controller');
import { Controller } from "./controller";
import { GlobalUse } from "../../global-use";
import { Command } from "../../plc/command";

export class PLCController implements Controller {

    path = '/plc/'
    router = express.Router()

    constructor() {

        this.router.post('/read', this.read)
        this.router.post('/write', this.write)

    }

    read = async (req, res) => {

        let body = req.body

        let cmd = Command.read(0x1000, 5)

        let plc_res = await GlobalUse.plc.send(cmd)
        let result = Command.parseRes(plc_res)

        res.status(200).send({
            success: true,
            result: result,
        })
    }

    write = async (req, res) => {

        let body = req.body

        let cmd = Command.write(0x1000,
            [
                0x1 << 0,
                0x1 << 1,
                0x1 << 2,
                0x1 << 3,
                0x1 << 4,
            ])

        let plc_res = await GlobalUse.plc.send(cmd)
        let result = Command.parseRes(plc_res)

        res.status(200).send({
            success: true,
            result: result,
        })
    }

}