import { Router } from "express";
import { handleDelete, handlePost } from "../../controllers/api/productosController.js";
import { setOwner } from "../../middlewares/owner.js";
import { rolDelete } from "../../middlewares/producto/rolDelete.js";
import { premium } from "../../middlewares/producto/premium.js";

export const productosRouter = Router()

productosRouter.post('/post', setOwner ,handlePost)

productosRouter.delete('/delete', premium, rolDelete ,handleDelete)