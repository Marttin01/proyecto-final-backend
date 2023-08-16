import { Ticket } from "../../models/Ticket.js"
import { carritoRepository } from "../../repositories/carritoRepository.js"
import { productosRepository } from "../../repositories/productosRepository.js"
import { ticketRepository } from "../../repositories/ticketRepository.js"
import { usuarioRepository } from "../../repositories/usuariosRepository.js"

export async function handlePost (req,res,next){
    // console.log(req.credenciales)
    // console.log(req.credenciales)
    const email = req.credenciales.email
    const carrito = await carritoRepository.readByCartId(req.credenciales.cart.idCarrito?req.credenciales.cart.idCarrito:req.credenciales.cart)
    const valores = []

    await Promise.all(
    carrito.productos.map(async (producto) => {
        // console.log(producto.idProduct)
        const encontrado = await productosRepository.readById(producto.idProduct)
        // console.log(encontrado)
        if(encontrado.stock > producto.cantidad){
            // console.log('el stock del producto es mayor que el del carrito')
            const valor = encontrado.price * producto.cantidad
            // console.log(valor)
            valores.push(valor)
            // console.log(valores)
            const nuevoProducto = {
                ...encontrado,
                stock:encontrado.stock-producto.cantidad
            }
            await productosRepository.updateOne(encontrado,nuevoProducto)
            const index = carrito.productos.findIndex((p) => p.idProduct === producto.idProduct)
            // console.log(index)
            carrito.productos.splice(index,1)
            // console.log(carrito)
            
            // const nuevoCarrito = {
            //     ...carrito
            // }

            const viejoCart = await carritoRepository.readByCartId(req.credenciales.cart.idCarrito?req.credenciales.cart.idCarrito:req.credenciales.cart)

            await carritoRepository.updateOne(viejoCart,carrito)
        }else {
            // console.log('el stock del producto es menor o igual que el del carrito')
            throw new Error('Producto sin suficiente stock')
        }
    })    
    )

    // console.log(valores)
    const total = valores.reduce((first,second) => first + second, 0)
    // console.log(total)

    const nuevoTicket = {
        amount:total,
        purcharser:email
    }

    const ticket = new Ticket(nuevoTicket)
    // console.log(ticket.dto())
    const creado = await ticketRepository.create(ticket.dto())
    // console.log(creado)
    res.sendStatus(201)
}

export async function handlePut (req,res,next){
    const idProducto = req.body.id
    // console.log(idProducto)

    const carritoUser = req.credenciales.cart.idCarrito?req.credenciales.cart.idCarrito:req.credenciales.cart
    // const producto = await productosRepository.readById(idProducto)
    
    // console.log(producto)
    const carritoBuscado = await carritoRepository.readByCartId(carritoUser)

    let productoExiste = carritoBuscado.productos.find((p)=> p.idProduct === idProducto)
    


    let productoCarrito = {
        // nombre:productoExiste.
        idProduct:idProducto,
        cantidad:productoExiste?productoExiste.cantidad+1:1
    }

    if(productoExiste){
        productoExiste = productoCarrito

        let indiceProducto = carritoBuscado.productos.findIndex((p) => p.idProduct === idProducto)

        const newProduct = carritoBuscado.productos.splice(indiceProducto,1) 

        const nuevoCarrito = {
            ...carritoBuscado,
            productos:carritoBuscado.productos.concat(productoExiste)  
        }

        await carritoRepository.updateMany(carritoBuscado,nuevoCarrito)
    }else{
        const nuevoCarrito = {
            ...carritoBuscado,
            productos:carritoBuscado.productos.concat(productoCarrito)  
        }

        const carritoActualizado = await carritoRepository.updateOne(carritoBuscado, nuevoCarrito)

    } 

    const carritoBuscado2 = await carritoRepository.readByCartId(carritoUser)
    
    const user = await usuarioRepository.readByEmail(req.credenciales.email)


    const newUser = {
        ...user,
        cart:carritoBuscado2
    }


    await usuarioRepository.updateOne({email:req.credenciales.email}, newUser)


    res.sendStatus(201)
}

export async function handleDelete (req,res,next){
    // console.log(req.body)
    const idProducto = req.body.id
    const emailUser = req.credenciales.email
    const user = await usuarioRepository.readByEmail(emailUser)
    const cartUser = await carritoRepository.readByCartId(req.credenciales.cart.idCarrito?req.credenciales.cart.idCarrito:req.credenciales.cart)
    // console.log(cartUser)

    let productoExiste = cartUser.productos.find((p)=> p.idProduct === idProducto)
    // console.log(productoExiste)KC

    if(productoExiste){
        if(productoExiste.cantidad > 1){
            productoExiste.cantidad--
            let indiceProducto = cartUser.productos.findIndex((p)=> p.idProduct === idProducto)
            cartUser.productos.splice(indiceProducto,1)
            cartUser.productos.push(productoExiste)

            const carrito = await carritoRepository.readByCartId(req.credenciales.cart.idCarrito?req.credenciales.cart.idCarrito:req.credenciales.cart)
            await carritoRepository.updateOne(carrito,cartUser)
            res.sendStatus(201)
        }else{
            let indiceProducto = cartUser.productos.findIndex((p)=> p.idProduct === idProducto)
            cartUser.productos.splice(indiceProducto,1)

            const carrito = await carritoRepository.readByCartId(req.credenciales.cart.idCarrito?req.credenciales.cart.idCarrito:req.credenciales.cart)
            await carritoRepository.updateOne(carrito,cartUser)
            res.sendStatus(201)
        }
    }

}