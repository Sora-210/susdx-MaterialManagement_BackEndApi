//import & instance
import { Router } from 'express'
import path = require("path");
import fs = require("fs");
import glob = require("glob");
const InferenceRouter = Router()

//最新推論結果
InferenceRouter.get('/:cameraId/latest', (req, res) => {
    const dirPath = path.join('/work/Inference/testProject', req.params.cameraId);
    let fileName:string = "";
    glob('**/**/*.json', {cwd:dirPath} , (e, files) => {
        fileName = files[files.length - 1];
        
        const json = JSON.parse(fs.readFileSync(path.join(dirPath, fileName), "utf8"));
        res.status(200).json(json);
    })
})

InferenceRouter.get('/:cameraId/:year/:month/:fileName', (req, res) => {
    const dirPath = path.join('/work/Inference/testProject', req.params.cameraId, req.params.year, req.params.month);
    let fileName:string = req.params.fileName + ".json";

    try {
        const json = JSON.parse(fs.readFileSync(path.join(dirPath, fileName), "utf8"));
        res.status(200).json(json);
    } catch {
        res.status(404).json("NotFound")
    }
})

InferenceRouter.all('*', (req, res, next) => {
    next()
})

export {
    InferenceRouter
}