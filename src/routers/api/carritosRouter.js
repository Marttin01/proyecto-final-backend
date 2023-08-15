import { Router } from "express"
import { handleDelete, handlePost, handlePut } from "../../controllers/api/carritosController.js"


export const carritosRouter = Router()


carritosRouter.post('/:cid/purchase', handlePost)

carritosRouter.put('/addProduct', handlePut )

carritosRouter.delete('/deleteProduct',handleDelete)