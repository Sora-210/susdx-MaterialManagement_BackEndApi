//import & instance準備
import { Router } from 'express'
import path = require("path");
import fs = require("fs");
import glob = require("glob");
const ListRouter = Router()

ListRouter.get('/list', (req, res) => {
    let camStatus = false
    const dirPath = path.join('/work/image');
    glob('*.jpg', {cwd:dirPath} , (e, files) => {
        if (!files.length) {
            res.status(404).send("NotFoundLatestFile")
        } else {
            const imagePath = files[(files.length - 2)].split('.')[0].split('-').map(n => Number(n))
            const lastUpdateDate = new Date(imagePath[0], imagePath[1] - 1, imagePath[2], imagePath[3])
            const nowDate = new Date(Date.now() - 7200000 + 32400000) 
            if (lastUpdateDate.valueOf() > nowDate.valueOf()) {
                camStatus = true
                console.log(camStatus)
            }
            const resJson = [
                {
                  deviceName: 'Jetson-1',
                  redisteredDate: '2022-03-09',
                  cameraList: [
                    {
                      cameraName: 'Camera 1',
                      status: camStatus,
                    },
                  ],
                },
            ]
            res.status(200).json(resJson)
        }
    })
})

//画像リストのjson取得
ListRouter.get('/cam1/list', (req, res) => {
    const dirPath = path.join('/work/image');
    glob('*.jpg', {cwd:dirPath} , (e, files) => {
        const json = {"count": files.length,"list": files}

        res.status(200).json(json);
    })
})
ListRouter.get('/cam1/list/:year', (req, res) => {
    const dirPath = path.join('/work/image');
    glob(req.params.year + '-' + '*.jpg', {cwd:dirPath} , (e, files) => {
        const json = {"count": files.length,"list": files}

        res.status(200).json(json);
    })
})
ListRouter.get('/cam1/list/:year/:month', (req, res) => {
    const dirPath = path.join('/work/image');
    glob(req.params.year + '-' + req.params.month + '-' + '*.jpg', {cwd:dirPath} , (e, files) => {
        const json = {"count": files.length,"list": files}

        res.status(200).json(json);
    })
})
ListRouter.get('/cam1/list/:year/:month/:day', (req, res) => {
    const dirPath = path.join('/work/image');
    glob(req.params.year + '-' + req.params.month + '-' + req.params.day + '-' + '*.jpg', {cwd:dirPath} , (e, files) => {
        const json = {"count": files.length,"list": files}

        res.status(200).json(json);
    })
})

ListRouter.all('*', (req, res, next) => {
    next()
})

export {
    ListRouter
}