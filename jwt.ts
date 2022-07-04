//import & instance準備
import { Router, Response, NextFunction } from 'express'
import { verify, TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
import { IncomingMessage } from 'http';
import { get } from 'https';
import { exit } from 'process';

//=================公開鍵取得=================
let publicKey: String
get('https://auth.sus-dx.sora210.net/publickey', (res: IncomingMessage) => {
    if (res.statusCode !== 200) {
        console.error("公開鍵の取得に失敗しました")
        exit(1)
    }
    res.on('data', (r) => {
        publicKey = r.toString()
    })
})

//=================認証関数=================

function vertify(token: String, res: Response, next: NextFunction) {
    if(token === undefined) {
        res.status(401).json({
            status: "Error",
            ErrorCode: "4001",
            detail: "Token does noe exist"
        })
        return
    }
    try {
        const decodeToken = verify(token, publicKey, { algorithms: ['RS512'] })
        next()
    } catch(e) {
        if (e instanceof TokenExpiredError) {
            res.status(403).json({
                status: "Error",
                ErrorCode: "4002",
                detail: "Token is expried"
            })
        } else if (e instanceof JsonWebTokenError) {
            res.status(403).json({
                status: "Error",
                ErrorCode: "4003",
                detail: "Token is invalid"
            })
        } else {
            res.status(500).json({
                status: 'Error',
                ErrorCode: "5000",
                detail: 'Unknown error occurred / Please contact to server administrator'
            })
        }
    }
}

//=================認証系Router=================

const verifyRouter = Router()

verifyRouter.get('/:projectId/image/*', (req, res, next) => {
    const token = req.query.authorization.toString()
    vertify(token, res, next)
})

verifyRouter.all('/', (req, res, next) => {
    const token:String = req.headers["authorization"].split(" ")[1].toString()
    vertify(token, res, next)
})

export {
    verifyRouter
}