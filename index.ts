//Import
import express = require("express")
import path = require("path");
import fs = require("fs");

//express instance
const app = express();

//最新画像取得
app.get('/cam1', (req, res) => {
    const dirPath = path.join('/work/image');
    fs.readdir(dirPath, (e, files) => {
        if (!files.length) {
            res.status(404).send("NotFoundLatestFile")
        } else {
            const imagePath = path.join(dirPath, files[(files.length - 1)]);
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

//画像リストのjson取得
app.get('/cam1/list', (req, res) => {
    const dirPath = path.join('/work/image');
    fs.readdir(dirPath, (e, files) => {
        const json = {"count": files.length,"list": files}

        res.status(200).json(json);
    })
})

//時間指定画像取得
app.get('/cam1/:name', (req, res) => {
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

//その他URLで404ページを返す
app.get("*", (req, res) => {
    res.status(404).send("NotFound");
})

//アプリケーション起動
app.listen('80', () => {
    console.log("server Started!");
    console.log("lintening port 80");
})