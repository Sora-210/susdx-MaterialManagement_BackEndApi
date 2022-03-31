//import & instance準備
import { Router } from 'express'
import path = require("path");
import fs = require("fs");
const ConfigRouter = Router()

ConfigRouter.get('/config/inference/:cameraId', (req, res) => {
    const dirPath = path.join('/work/config');
    const list = fs.readdirSync(dirPath, {withFileTypes: true})
          .filter(dirent => dirent.isFile()).map(({name}) => name)
          .filter(function(file) 
          {
              return file === 'inference.json';
          });
    const json = JSON.parse(fs.readFileSync(path.join(dirPath, "/" + list[0]), "utf8"))
    res.status(200).json(json)
})

ConfigRouter.all('*', (req, res, next) => {
    next()
})

export {
    ConfigRouter
}