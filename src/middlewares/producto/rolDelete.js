import { productosRepository } from "../../repositories/productosRepository.js"

export async function rolDelete (req,res,next) {
    try {
        const producto = await productosRepository.readById(req.body.id)
        // console.log(producto)
        if(req.credenciales.rol === 'admin'){
            next()
        }else if(producto.owner === req.credenciales.email){
            next()
        }else{
            throw new Error('El producto no es de su propiedad')
        }
    } catch (error) {
        next(error)
    }
}