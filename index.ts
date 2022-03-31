//Import
import express = require("express")
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

//Project
import { ProjectRouter } from './Route/Project'
app.use('/', ProjectRouter)

//List
import { ListRouter } from './Route/List'
app.use('/:projectId/', ListRouter)

//Image
import { ImageRouter } from './Route/Image'
app.use('/:projectId/', ImageRouter)

//Inference
import { InferenceRouter } from './Route/Inference'
app.use('/:projectId/', InferenceRouter)

//区画範囲取得
import { ConfigRouter } from './Route/Config'
app.use('/:projectId/', ConfigRouter)


//その他URLで404ページを返す
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