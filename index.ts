//Import
import express = require("express")
import path = require("path");
import fs = require("fs");
import glob = require("glob");
import jwt = require('jsonwebtoken');
const cors = require('cors');

const privateKey = fs.readFileSync(process.env.privateKeyPath)
const publicKey = fs.readFileSync(process.env.publicKeyPath)

//express instance
const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

//add cors header
app.use(cors())

//認証
function verifyToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    if (authHeader !== undefined) {
        if (authHeader.split(" ")[0] === "Bearer") {
            try {
                const token = jwt.verify(authHeader.split(" ")[1], privateKey, {algorithms: 'RS512'});
                next()
            } catch (e) {
                res.status(401).json({message: e.message})
            }
        } else {
            res.status(401).json({message: 'header format error'})
        }
    } else {
        const authQuery = req.query.authorization
        if (authQuery !== undefined) {
            try {
                const token = jwt.verify(authQuery, privateKey, {algorithms: 'RS512'});
                next()
            } catch (e) {
                res.status(401).json({message: e.message})
            }
        } else {
            res.status(401).json({message: 'header error'})
        }
    }
}

//login
app.post('/login', (req, res) => {
    const accountId = req.body.accountId;
    const password = req.body.password;

    if (accountId === 'sus' && password === 'suwarika') {
        const token = jwt.sign({ accountId: accountId }, privateKey, { algorithm: 'RS512', expiresIn: '1h'} )
        res.status(200).json({
            token: token
        })
    } else {
        res.status(400).json({message: 'error'})
    }
})

app.use(verifyToken);

//カメラデバイスリスト
app.get('/list', (req, res) => {
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

//最新画像取得
app.get('/cam1', (req, res) => {
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

//画像リストのjson取得
app.get('/cam1/list', (req, res) => {
    const dirPath = path.join('/work/image');
    glob('*.jpg', {cwd:dirPath} , (e, files) => {
        const json = {"count": files.length,"list": files}

        res.status(200).json(json);
    })
})
app.get('/cam1/list/:year', (req, res) => {
    const dirPath = path.join('/work/image');
    glob(req.params.year + '-' + '*.jpg', {cwd:dirPath} , (e, files) => {
        const json = {"count": files.length,"list": files}

        res.status(200).json(json);
    })
})
app.get('/cam1/list/:year/:month', (req, res) => {
    const dirPath = path.join('/work/image');
    glob(req.params.year + '-' + req.params.month + '-' + '*.jpg', {cwd:dirPath} , (e, files) => {
        const json = {"count": files.length,"list": files}

        res.status(200).json(json);
    })
})
app.get('/cam1/list/:year/:month/:day', (req, res) => {
    const dirPath = path.join('/work/image');
    glob(req.params.year + '-' + req.params.month + '-' + req.params.day + '-' + '*.jpg', {cwd:dirPath} , (e, files) => {
        const json = {"count": files.length,"list": files}

        res.status(200).json(json);
    })
})

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
app.get('/cam1/config/inference', (req, res) => {
    const dirPath = path.join('/work/inference');
    const list = fs.readdirSync(dirPath, {withFileTypes: true})
          .filter(dirent => dirent.isFile()).map(({name}) => name)
          .filter(function(file) 
          {
              return file === 'config.json';
          });
    const json = JSON.parse(fs.readFileSync(path.join(dirPath, "/" + list[0]), "utf8"))
    res.status(200).json(json)
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