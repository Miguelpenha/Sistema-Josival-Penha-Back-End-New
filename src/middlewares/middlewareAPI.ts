import { Request, Response, NextFunction } from 'express'

function middlewareAPI(req: Request, res: Response, next: NextFunction) {
    const keyBruta = req.header('Authorization') || req.body.keyapi

    if (keyBruta) {
        const key = keyBruta.replace('key ', '')
        const keysAuthorized = process.env.API_KEYS_AUTHORIZED.split(',')
        
        if (keysAuthorized.includes(key)) {
            next()
        } else {
            res.status(401)
            res.json({ unauthorized: true })
        }
    } else {
        res.status(401)
        res.json({ unauthorized: true })
    }
}

export default middlewareAPI