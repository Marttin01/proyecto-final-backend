import { Router } from "express"
import { handleDelete, handleDeleteAll, handleGet, handlePost, handlePut, handleRestablecer, handleRestablecer2 } from "../../controllers/api/usuariosController.js"
import { rolAuth } from "../../middlewares/rolAuth.js"
import { upload } from "../../utils/multer.js"
import { handleFileMulter, handleMulter } from "../../controllers/api/multer/multerController.js"
import { tieneDoc } from "../../middlewares/premium/docPremium.js"

export const usuariosRouter = Router()

usuariosRouter.get('/', handleGet)

usuariosRouter.post('/register', rolAuth ,handlePost)

usuariosRouter.post('/restablecer', handleRestablecer)

usuariosRouter.post('/:uid/documentos', upload.single('document'), handleFileMulter, handleMulter)

usuariosRouter.put('/premium', tieneDoc ,handlePut)

usuariosRouter.put('/restablecer/nueva', handleRestablecer2)

usuariosRouter.delete('/delete', handleDelete )

usuariosRouter.delete('/', handleDeleteAll)