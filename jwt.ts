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

//Methods
const verifyToken = (req, res, next, privateKey) => {
    const authHeader = req.headers["authorization"].split(" ");
    if (authHeader !== undefined) {
        if (authHeader[0] === "Bearer") {
            try {
                const token = jwt.verify(authHeader[1], privateKey, {algorithms: 'RS512'});
                next()
            } catch (e) {
                res.status(401).json(responseMessageList['headerError'])
            }
        } else {
            res.status(401).json(responseMessageList['undefinedError'])
        }
    } else {
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
    }
}

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
    verifyToken,
    signToken
}