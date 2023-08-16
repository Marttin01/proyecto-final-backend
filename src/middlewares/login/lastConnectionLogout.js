import { usuarioRepository } from "../../repositories/usuariosRepository.js"

export async function logoutLastConnection (req,res,next){
    try {
        const usuario = await usuarioRepository.readByEmail(req.credenciales.email)
        
        const nuevoUsuario = {
            ...usuario,
            last_connection: new Date().toLocaleString()
        }

        await usuarioRepository.updateOne({email:usuario.email}, nuevoUsuario)

        next()
    } catch (error) {
        next(error)
    }
}