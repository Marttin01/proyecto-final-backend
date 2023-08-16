import { crypto } from "../utils/criptografia.js"

export function extraerCredenciales (req,res,next) {
    try {
        if(!req.signedCookies['authToken']){
            next()
            // console.log("no agarra la cookie"
        }else {
            const token = req.signedCookies['authToken']

            // console.log(token)

            const dataUser = crypto.decodificarToken(token)
            
            req.credenciales = dataUser
            next()
        }
    } catch (error) {
        next(error)
    }
}

export function autenticadosWeb (req,res,next){
    try {
        if(!req.credenciales) {
            res.redirect('/')
        }else{
            next()
        }
    } catch (error) {
        next(error)
    }
    
    
}