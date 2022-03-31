//import & instance準備
import { Router } from 'express'
const ProjectRouter = Router()

//ProjectCheck
ProjectRouter.all('/:projectId/*', (req, res, next) => {
    const projectId = req.params.projectId
    console.log(projectId)
    //一時的に固定チェック
    if (projectId === 'testProject') {
        next()
    } else {
        const resMessage = {
            status: 'error',
            message: 'Project Not Found'
        }
        res.status(404).json(resMessage)
    }
})

export {
    ProjectRouter
}