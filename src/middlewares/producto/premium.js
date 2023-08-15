import { createTransport } from "nodemailer"
import { productosRepository } from "../../repositories/productosRepository.js"
import { usuarioRepository } from "../../repositories/usuariosRepository.js"
import { SERVER_EMAIL, SERVER_EMAIL_PASSWORD } from "../../server.config/email.config.js"

export async function premium (req,res,next){
    try {
        const producto = await productosRepository.readById(req.body.id)
        const usuarioProducto = await usuarioRepository.readByEmail(producto.owner)

        if(usuarioProducto.rol === "premium"){

            const clienteNodemailer = createTransport({
                host:'smtp.ethereal.email',
                port: 587,
                auth: {
                    user: SERVER_EMAIL,
                    pass: SERVER_EMAIL_PASSWORD
                }
            })

            const email = SERVER_EMAIL

            const mailOptions = {
                from:email,
                to: producto.owner,
                subject: 'Eliminacion de producto',
                text:`Su producto ( ${producto.title} ) ha sido eliminado. Gracias vuelva prontos :)`
            }

            await clienteNodemailer.sendMail(mailOptions)
            next()
        }else next()
    } catch (error) {
        next(error)
    }
}