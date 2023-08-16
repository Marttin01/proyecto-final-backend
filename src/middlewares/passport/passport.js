import passport from "passport"
import { Strategy as JwtStrategy} from "passport-jwt"
import { Strategy } from "passport-local"
import { usuarioRepository } from "../../repositories/usuariosRepository.js"
import { crypto } from "../../utils/criptografia.js"
import { cookieExtractor } from "../../utils/cookieExtractor.js"
import { JWT_SECRET } from "../../server.config/auth.config.js"


passport.use('local', new Strategy({ usernameField:'email' }, async (email,password,done) => {
    try {
        const usuario = await usuarioRepository.readByEmail(email)
        // console.log(usuario)
        if(!usuario){
            return done(null, false, {message: 'Email no encontrado'})
        }  
        // console.log(usuario['password'])
        
        if(crypto.validarIgualdad(password,usuario.password) === false) {
            // console.log('no concuerdan contraseñas')
            return done(null,false, {message: 'Contraseña incorrecta'})
        }
        // console.log(usuario)
        return done(null,usuario)
    } catch (error) {
        return done(error)
    }
}))

passport.use('jwt', new JwtStrategy({ jwtFromRequest:cookieExtractor, secretOrKey:JWT_SECRET }, (jwt_payload,done) => {
    try {
        done(null,jwt_payload)
    } catch (error) {
        done(error)
    }
}))

export const loginUserPass = passport.authenticate('local', {failWithError:true, session:false})

export function autenticacionJwt(req,res,next) {
    passport.authenticate('jwt', (error,jwt_payload) => {
        if(error) throw new Error(`${error}`)
        if(!jwt_payload) throw new Error('JWT paylaod es null')
        req.user = jwt_payload
        next()
    })(req,res,next)
}