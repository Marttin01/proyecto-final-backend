export async function erroHandler (error,req,res,next) {
    console.log(error)
    res.json({ errorMsg: error.message}).status(500)
}