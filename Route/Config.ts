//import & instance
import { Router } from 'express'
import path = require("path");
import fs = require("fs");
const ConfigRouter = Router();

const rootDirPath = path.join('/work/config');

ConfigRouter.get('/config/:cameraId/inference', (req, res) => {
    const json = JSON.parse(fs.readFileSync(path.join(rootDirPath, req.params.cameraId,"inference.json"), "utf8"));
    res.status(200).json(json);
})

ConfigRouter.all('*', (req, res, next) => {
    next()
})

export {
    ConfigRouter
}