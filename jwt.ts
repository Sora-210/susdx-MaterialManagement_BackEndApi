import fs = require("fs");
import jwt = require('jsonwebtoken');

const privateKey = fs.readFileSync(process.env.privateKeyPath)
const publicKey = fs.readFileSync(process.env.publicKeyPath)

const verifyToken = (req, res, next, privateKey) => {
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