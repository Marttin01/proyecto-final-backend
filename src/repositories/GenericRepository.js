export class GenericRepository {
    #dao
    constructor(dao){
        this.#dao = dao
    }

    create(data){
        return this.#dao.create(data)
    }

    readOne(criteria){
        return this.#dao.readOne(criteria)
    }

    readByEmail(email){
        return this.#dao.readByEmail(email)
    }

    readById (id){
        return this.#dao.readById(id)
    }

    readByCartId (id) {
        return this.#dao.readByCartId(id)
    }

    readMany(filter){
        return this.#dao.readMany(filter)
    }

    updateOne(criteria,newCriteria){
        return this.#dao.updateOne(criteria, newCriteria)
    }

    updateMany(criteria, newCriteria){
        return this.#dao.updateMany(criteria, newCriteria)
    }

    deleteOne(criteria){
        return this.#dao.deleteOne(criteria)
    }

    deleteAllConnection(){
        return this.#dao.deleteMany()
    }
}