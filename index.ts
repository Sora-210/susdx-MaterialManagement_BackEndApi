//Import
import express = require("express")
import path = require("path");
import fs = require("fs");
import glob = require("glob");
const cors = require('cors');
import { verifyToken } from './jwt'

//express instance
const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

//add cors header
app.use(cors())

//login
import { LoginRouter } from './Route/Auth'
app.use('/', LoginRouter)


//以下認証必須
app.use(verifyToken);

//List
import { ListRouter } from './Route/List'
app.use('/', ListRouter)

//Image
import { ImageRouter } from './Route/Image'
app.use('/', ImageRouter)



//最新推論結果取得
app.get('/cam1/inference', (req, res) => {
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

//区画範囲取得
import { ConfigRouter } from './Route/Config'
app.use('/', ConfigRouter)



//その他URLで404ページを返す
app.get("*", (req, res) => {
    res.status(404).send("NotFound");
})

//アプリケーション起動
app.listen('80', () => {
    console.log("server Started!");
    console.log("lintening port 80");
})