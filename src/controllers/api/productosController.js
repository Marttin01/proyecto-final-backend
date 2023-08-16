import { Producto } from "../../models/Productos.js"
import { productosRepository } from "../../repositories/productosRepository.js"

export async function handlePost (req,res,next){
    try {
        // console.log(req.body)
        const producto = new Producto(req.body)
        // console.log(producto.dto())
        const creado = await productosRepository.create(producto.dto())

        // console.log(creado)
        res.sendStatus(201)
    } catch (error) {
        next(error)
    }
}

export async function handleDelete (req,res,next){
    try {
        // console.log(req.body)
        const producto = await productosRepository.readById(req.body.id)
        const eliminado = await productosRepository.deleteOne(producto)

        res.sendStatus(201)
    } catch (error) {
        next(error)
    }
}