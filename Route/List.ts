//import & instance
import { Router } from 'express'
import path = require("path");
import fs = require("fs");
import glob = require("glob");
const ListRouter = Router()

const rootDirPath = path.join('/work/Image');

ListRouter.get('/list', (req, res) => {
    let camStatus = true
    const resJson = [
        {
            deviceName: 'Jetson-1',
            redisteredDate: '2022-03-09',
            cameraList: [
            {
                cameraName: 'Camera 1',
                cameraId: '1',
                status: camStatus,
            },
            ],
        },
    ]
    res.status(200).json(resJson)
})

//画像リスト�?�json取�?
ListRouter.get('/list/:cameraId', (req, res) => {
    glob('*', {cwd:path.join(rootDirPath, "testProject", req.params.cameraId)} , (e, files) => {
        const json = {"count": files.length,"list": files}
        json.list = json.list.map(e => e.replace(".png", ""))
        res.status(200).json(json);
    })
})
ListRouter.get('/list/:cameraId/:year', (req, res) => {
    glob(req.params.year + '/*', {cwd:path.join(rootDirPath, "testProject", req.params.cameraId)} , (e, files) => {
        const json = {"count": files.length,"list": files}
        json.list = json.list.map(e => e.replace(".png", ""))
        res.status(200).json(json);
    })
})
ListRouter.get('/list/:cameraId/:year/:month', (req, res) => {
    glob(req.params.year + '/' + req.params.month + '/*', {cwd:path.join(rootDirPath, "testProject", req.params.cameraId)} , (e, files) => {
        const json = {"count": files.length,"list": files}
        json.list = json.list.map(e => e.replace(".png", ""))
        res.status(200).json(json);
    })
})
ListRouter.get('/list/:cameraId/:year/:month/:day', (req, res) => {
    glob(req.params.year + '/' + req.params.month + '/' + req.params.day + '-*.png', {cwd:path.join(rootDirPath, "testProject", req.params.cameraId)} , (e, files) => {
        const json = {"count": files.length,"list": files}
        json.list = json.list.map(e => e.replace(".png", ""))
        res.status(200).json(json);
    })
})

ListRouter.all('*', (req, res, next) => {
    next()
})

export {
    ListRouter
}