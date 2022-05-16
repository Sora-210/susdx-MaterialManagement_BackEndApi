//Import
import express = require("express")
const cors = require('cors');
import { verifyRouter } from './jwt'

//setting
process.env.TZ = "Asia/Tokyo";

//create express instance
const app = express();
app.use(express.json({ limit: 2000000 }))
app.use(express.urlencoded({ limit: 2000000, extended: true }));

//add cors header
app.use(cors())

//login
import { LoginRouter } from './Route/Auth'
app.use('/', LoginRouter)

//トークンチェック
app.use('/', verifyRouter);

//Project
import { ProjectRouter } from './Route/Project'
app.use('/', ProjectRouter)

//List
import { ListRouter } from './Route/List'
app.use('/:projectId/', ListRouter)

//Image
import { ImageRouter } from './Route/Image'
app.use('/:projectId/image/', ImageRouter)

//Inference
import { InferenceRouter } from './Route/Inference'
app.use('/:projectId/inference/', InferenceRouter)

//config
import { ConfigRouter } from './Route/Config'
app.use('/:projectId/', ConfigRouter)


//見つからなかった場合404レスポンス
const resMessageNotFound = {
    status: 'error',
    message: 'NotFound'
}
app.get("*", (req, res) => {
    res.status(404).json(resMessageNotFound);
})

//アプリケーション起動
app.listen('80', () => {
    console.log("server Started!");
    console.log("lintening port 80");
})