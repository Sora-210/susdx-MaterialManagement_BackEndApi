//import & instance準備
import { Router } from 'express'
import { signToken } from '../jwt'
const LoginRouter = Router()

//login
LoginRouter.post('/login', (req, res) => {
    const accountId = req.body.accountId
    const password = req.body.password

    if (accountId === 'sus' && password === 'suwarika') {
        const token = signToken(accountId)
        res.status(200).json({
            token: token
        })
    } else {
        res.status(400).json({message: 'error'})
    }
})

LoginRouter.all('*', (req, res, next) => {
    next()
})

export {
    LoginRouter
}