//import & instance準備
import { Router } from 'express'
import fs = require("fs");
import jwt = require('jsonwebtoken');

const privateKey = fs.readFileSync(process.env.privateKeyPath)
// const publicKey = fs.readFileSync(process.env.publicKeyPath)

//Response Message List
const responseMessageList = {
    formatError: {
        status: 'authorizationError',
        message: 'Header Format Error',
    },
    headerError: {
        status: 'authorizationError',
        message: 'Header Error',
    },
    undefinedError: {
        status: 'undefinedError',
        message: 'authorizationUndefinedError'
    }
}

const verifyRouter = Router()

verifyRouter.get('/:projectId/image/*', (req, res, next) => {
    const authQuery = req.query.authorization
    if (authQuery !== undefined) {
        try {
            const token = jwt.verify(authQuery, privateKey, {algorithms: 'RS512'});
            next()
        } catch (e) {
            res.status(401).json(responseMessageList['undefinedError'])
        }
    } else {
        res.status(401).json(responseMessageList['headerError'])
    }
})

verifyRouter.all('/', (req, res, next) => {
    const authHeader:String = req.headers["authorization"];
    
    if (authHeader !== undefined) {
        const authHeaderList = authHeader.split(" ")
        if (authHeaderList[0] === "Bearer") {
            try {
                const token = jwt.verify(authHeaderList[1], privateKey, {algorithms: 'RS512'});
                next()
            } catch (e) {
                res.status(401).json(responseMessageList['headerError'])
            }
        } else {
            res.status(401).json(responseMessageList['undefinedError'])
        }
    } else {
        res.status(401).json(responseMessageList['headerError'])
    }
})

const signToken = (accountId) => {
    const body = {
        accountId: accountId
    }
    const options = {
        algorithm: 'RS512',
        expiresIn: '1h'
    }
    return jwt.sign(body, privateKey, options)
}

export {
    verifyRouter,
    signToken
}