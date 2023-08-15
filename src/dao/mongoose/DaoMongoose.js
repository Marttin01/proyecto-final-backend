function toPojo(object){
    return JSON.parse(
        JSON.stringify(
            object
        )
    )
}

export class DaoMongoose {
    #model
    constructor(mongooseModel) {
        this.#model = mongooseModel
    }

    async create(element){
        return toPojo(await this.#model.create(element))
    }

    async readOne(criteria) {
        const result = await this.#model.findOne(criteria).lean()
        if(!result) throw new Error('Not found')
        return result
    }

    async readById (id){
        const result = await this.#model.findOne({idProducto:id}).lean()
        if(!result) throw new Error('Not found')
        return result
    }

    async readByCartId (id) {
        const result = await this.#model.findOne({idCarrito:id}).lean()
        if(!result) throw new Error('Not found')
        return result
    }

    async readByEmail(email){
        const user = await this.#model.findOne({email:email}).lean()
        if(!user)throw new Error('Not found')
        return user
    }

    async readMany(filter) {
        return await this.#model.find(filter).lean()
    }

    //el primer criteria tiene que ser un filtro {id:usuario.id}
    async updateOne(criteria, newCriteria) {
        const modificado = await this.#model.updateOne(criteria, newCriteria)
        if(!modificado) throw new Error('Not found')
        return toPojo(modificado)
    }

    async updateMany(criteria, newCriteria) {
        let objeto1 = {
            _id:criteria._id,
            idCarrito:criteria.idCarrito,
            productos:criteria.productos
        }
        let objeto2 = {
            _id:newCriteria._id,
            idCarrito:newCriteria.idCarrito,
            productos:newCriteria.productos
        }
        // console.log(objeto1)
        // console.log(objeto2)

        await this.#model.updateOne({_id:objeto1._id},objeto2)
    }

    async deleteOne(criteria) {
        const borrado = await this.#model.deleteOne(criteria)
        if(!borrado) throw new Error('Not found')
        return toPojo(borrado)
    }

    async deleteManyConnection(){
        return await this.#model.deleteMany()
    }
}