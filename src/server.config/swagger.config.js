import  swaggerJSDoc from 'swagger-jsdoc'

export const swaggerOptions = {
    definition:{
        openapi:"3.0.1",
        info:{
            title:"Documentacion",
            description:"Api del ecommerce"
        }
    },
    apis:['./docs/**/*.yaml']
}

export const specs = swaggerJSDoc(swaggerOptions)
