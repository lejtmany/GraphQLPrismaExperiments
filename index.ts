import express from 'express'
import { graphqlHTTP } from 'express-graphql'
import { buildSchema } from 'graphql'

let schema = buildSchema(`
    type Query {
        hello:String
    }
`)

let root = {
    hello: ()=> {
        return 'Booyah graphql'
    }
}

let app = express()

app.use('/graphql', graphqlHTTP({
    schema:schema,
    rootValue:root,
    graphiql:true
}))

app.listen(4000)
console.log("Started server")
