//import & instance
import { Router } from 'express'
import path = require("path");
import fs = require("fs");
const ImageRouter = Router()
import glob = require("glob");
import { paddingZero } from '../Methots';

//定数
const rootDir = path.join("/work")

ImageRouter.post('/', async (req, res) => {
    const time = new Date(req.body.time);
    const cameraId:string = req.body.cameraId
    const b64Image:string = req.body.b64Image;
    const inference:string = '{"data":[["camera' + cameraId + `",` + JSON.stringify(req.body.inference) + "]]}";

    const dirPath = path.join("testProject", cameraId, time.getFullYear().toString(), paddingZero(time.getMonth() + 1).toString());
    const fileName = paddingZero(time.getDate()) + "-" + paddingZero(time.getHours()) + "-" + paddingZero(time.getMinutes());
    
    try {
        //存在チェ�?ク
        if(
            fs.existsSync(path.join(rootDir, "Image", dirPath, fileName + ".png")) &&
            fs.existsSync(path.join(rootDir, "Inference", dirPath, fileName + ".json"))
        ) {
            throw new Error("ThereIsAlreadyIt");
        }

        //画像保�?
        if(!fs.existsSync(path.join(rootDir, "Image", dirPath))) {
            await fs.mkdirSync(path.join(rootDir, "Image", dirPath), { recursive: true });
        }
        await fs.promises.writeFile(path.join(rootDir, "Image", dirPath, fileName + ".png"), b64Image, { encoding: "base64" });

        //推論保�?
        if(!fs.existsSync(path.join(rootDir, "Inference", dirPath))) {
            await fs.mkdirSync(path.join(rootDir, "Inference", dirPath), { recursive: true });
        }
        await fs.promises.writeFile(path.join(rootDir, "Inference", dirPath, fileName + ".json"), inference, { encoding: "utf8" });
        
        //レスポンス
        res.status(201).json({
            status: "Success",
            message: "ImageFile and InferenceFile created.",
            fileName: fileName,
            endpoint: {
                image: "https://api.sus-dx.sora210.net/image/" + dirPath + "/" + fileName,
                inference: "https://api.sus-dx.sora210.net/inference/" + dirPath + "/" + fileName,
            },
        });
    } catch(e) {
        if (e.message == "ThereIsAlreadyIt") {
            res.status(409).json({
                status: "Error",
                message: "There is already it.",
                fileName: fileName
            });
        } else {
            res.status(500).send("Error")
        }
    }
})

ImageRouter.get('/:cameraId/latest', (req, res) => {
    const dirPath = path.join('/work/Image/testProject', req.params.cameraId);
    let fileName:string = "";
    glob('**/**/*.png', {cwd:dirPath} , (e, files) => {
        fileName = files[files.length - 1];
        fs.readFile(path.join(dirPath, fileName), (e, d) => {
            if (e) {
                res.status(404).send("NotFound");
            } else {
                res.type('jpg');
                res.status(200).send(d);
            }
        });
    })
})

ImageRouter.get('/:cameraId/:year/:month/:fileName', (req, res) => {
    const dirPath = path.join('/work/Image/testProject', req.params.cameraId, req.params.year, req.params.month);
    let fileName:string = req.params.fileName + ".png";

    fs.readFile(path.join(dirPath, fileName), (e, d) => {
        if (e) {
            res.status(404).send("NotFound");
        } else {
            res.type('jpg');
            res.status(200).send(d);
        }
    });
})

ImageRouter.all('*', (req, res, next) => {
    next()
})

export {
    ImageRouter
}