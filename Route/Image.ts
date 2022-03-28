//import & instance準備
import { Router } from 'express'
import path = require("path");
import fs = require("fs");
const ImageRouter = Router()
import glob = require("glob");

//最新画像取得
ImageRouter.get('/cam1', (req, res) => {
    const dirPath = path.join('/work/image');
    glob('*.jpg', {cwd:dirPath} , (e, files) => {
        if (!files.length) {
            res.status(404).send("NotFoundLatestFile")
        } else {
            const imagePath = path.join(dirPath, files[(files.length - 2)]);
            fs.readFile(imagePath, (e, d) => {
                if (e) {
                    res.status(404).send("NotFound");
                } else {
                    res.type('jpg');
                    res.status(200).send(d);
                }
            });
        }
    })
})

//時間指定画像取得
ImageRouter.get('/cam1/:name', (req, res) => {
    const imagePath = path.join('/work/image', req.params.name + ".jpg");
    fs.readFile(imagePath, (e, d) => {
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