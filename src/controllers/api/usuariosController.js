import { createTransport } from "nodemailer"
import { Cart } from "../../models/Cart.js"
import { Usuario } from "../../models/User.js"
import { carritoRepository } from "../../repositories/carritoRepository.js"
import { usuarioRepository } from "../../repositories/usuariosRepository.js"
import { crypto } from "../../utils/criptografia.js"
import { SERVER_EMAIL, SERVER_EMAIL_PASSWORD } from "../../server.config/email.config.js"

export async function handlePost (req,res,next) {
    try {
        const usuario = new Usuario(req.body) 
        const creado  = await usuarioRepository.create(usuario.dto())

        const cart = new Cart(creado.cart)
        const carritoCreado = await carritoRepository.create(cart.dto())

        const token = crypto.generarToken(creado)
        
        res.cookie('authToken', token, {httpOnly:true, signed:true,maxAge: 1000*60*60}) 

        res.sendStatus(201)

    } catch (error) {
        res.status(401)
        console.log(error)
    }
}

export async function handleDelete (req,res,next){
    try {

        const usuario = await usuarioRepository.readByEmail(req.body.email)

        await usuarioRepository.deleteOne(usuario)

        const carrito = await carritoRepository.readByCartId(usuario.cart.idCarrito?usuario.cart.idCarrito:usuario.cart)

        await carritoRepository.deleteOne(carrito)

        res.sendStatus(201)
    } catch (error) {
        next(error)
    }
}

export async function handlePut (req,res,next){
    try {
        // console.log(req.credenciales)
        const usuario = await usuarioRepository.readByEmail(req.credenciales.email)

        const nuevoUser = {
            ...usuario,
            rol:usuario.rol === 'premium'?'user':'premium'
        }

        await usuarioRepository.updateOne(usuario,nuevoUser)

        // console.log(req.credenciales)
        res.sendStatus(201)
    } catch (error) {
        next(error)
    }
}

export async function handleRestablecer (req,res,next){
    try {
        // console.log(req.body)
        const usuario = await usuarioRepository.readByEmail(req.body.email)
        // console.log(usuario)

        const token = crypto.generarToken(usuario)
        // console.log(token)
        
        res.cookie('recupToken', token, {httpOnly:true, signed:true, maxAge:1000*60*3}).send({status:'correct'})

        const clienteNodemailer = createTransport({
            host:'smtp.ethereal.email',
            port: 587,
            auth: {
                user: SERVER_EMAIL,
                pass: SERVER_EMAIL_PASSWORD
            }
        })

        const testEmail = SERVER_EMAIL

        const mailOptions = {
            from:testEmail,
            to: req.body.email,
            subject: 'Recuperar contraseña',
            html:`<h3>${usuario.first_name} ${usuario.last_name} restablezca su contraseña<h3><a href="http://localhost:8080/login/restablecer/nueva">Restablezca su contraseña</a>`
        }

        
        const info = await clienteNodemailer.sendMail(mailOptions)
        // console.log(info)

    } catch (error) {
        console.log(error)
    }
}

export async function handleRestablecer2 (req,res,next){
    try {
        const token = req.signedCookies['recupToken']
        const dataUser = crypto.decodificarToken(token)
        
        const usuario = await usuarioRepository.readByEmail(dataUser.email)
        res.clearCookie('recupToken')

        const newPassword = crypto.hashear(req.body.password)
        const newUsuario = {
            ...usuario,
            password:newPassword
        }

        await usuarioRepository.updateOne(usuario,newUsuario)

        res.sendStatus(201)
    } catch (error) {
        next(error)
    }
}

export async function handleGet (req,res,next){
    try {
       const usuarios = await usuarioRepository.readMany()
       
       res.json({status:"correct",payload:usuarios})
    } catch (error) {
        next(error)
    }
}

export async function handleDeleteAll (req,res,next){

    //FILTRO EN MINUTOS-------------------------------
    const tiempoActualString = new Date().toLocaleString()
    const tiempoActual = new Date(tiempoActualString)
    tiempoActual.setMinutes(tiempoActual.getMinutes() - 30)

    const tiempoRestadoString = tiempoActual.toLocaleString()
    const [mes, dia, año] = tiempoRestadoString.split('/')
    const fechaFormateada = `${dia}/${mes}/${año}`
    console.log(fechaFormateada)
   
    const filter = { last_connection: { $lte: fechaFormateada } }

    //FILTRO EN MESES--------------------------------
    const mesActualString = new Date().toLocaleString()
    const mesActual = new Date(mesActualString)

    const mesRestadoString = mesActual.toLocaleString()
    const [mes1, dia1, año1] = mesRestadoString.split('/')
    const fechaFormateada2 = `${dia1}/${mes1 - 1}/${año1}`
    const [fecha] = fechaFormateada2.split(',')
    const mesFormateado = `${fecha}`

    const monthFilter = { last_connection: { $lt: mesFormateado }}

    try {
        
        const usuarios = await  usuarioRepository.readMany(filter)
    
        const adminUser = usuarios.filter((u) => u.email.includes("admin.com"))
        if(adminUser){
          
            adminUser.forEach((admin) => {
                const indice = usuarios.indexOf(admin)
                usuarios.splice(indice,1)
            })
        } 


        const clienteNodemailer = createTransport({
            host:'smtp.ethereal.email',
            port: 587,
            auth: {
                user: SERVER_EMAIL,
                pass: SERVER_EMAIL_PASSWORD
            }
        })

        const testEmail = SERVER_EMAIL

        usuarios.forEach(async (usuario) => {
           
            const mailOptions = {
                from:testEmail,
                to: usuario.email,
                subject: 'Eliminacion de cuenta',
                text:`Su cuenta ( ${usuario.email} ) ha sido eliminada por inactividad. Gracias vuelva prontos :)`
            }
            
            await clienteNodemailer.sendMail(mailOptions)
            await usuarioRepository.deleteOne(usuario)
        })
        
        res.sendStatus(201)
    } catch (error) {
        next(error)
    }
}