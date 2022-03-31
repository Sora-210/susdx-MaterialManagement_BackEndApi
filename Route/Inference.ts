//import & instance準備
import { Router } from 'express'
import path = require("path");
import fs = require("fs");
const InferenceRouter = Router()

//最新推論結果取得
InferenceRouter.get('/inference/:cameraId', (req, res) => {
    const dirPath = path.join('/work/inference');
    const list = fs.readdirSync(dirPath, {withFileTypes: true})
          .filter(dirent => dirent.isFile()).map(({name}) => name)
          .filter(function(file) 
          {
              return path.extname(file).toLowerCase() === '.json';
          });
    const json = JSON.parse(fs.readFileSync(path.join(dirPath, "/" + list[list.length - 1]), "utf8"))
    res.status(200).json(json)
})

InferenceRouter.all('*', (req, res, next) => {
    next()
})

export {
    InferenceRouter
}