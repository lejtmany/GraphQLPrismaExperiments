import express from 'express'
import { graphqlHTTP } from 'express-graphql'
import { buildSchema } from 'graphql'

let schema = buildSchema(`
    type Query {
        hello:User
    }

    type User {
        firstName: String
        lastName: String
        random: Int
        pets(species:Species):[Pet!]!
    }

    type Pet {
        name:String
        species: Species
    }

    enum Species {
        DOG
        CAT
        FISH
    }
`)
let pets = [
    {name: 'Fido', species: "DOG"},
    {name: 'Goldie', species: "FISH"},
    {name: 'Spot', species: "DOG"},
    {name: 'Muffins', species: "CAT"},
]
let root = {
    hello: ()=> {
        return {
            firstName: "John",
            lastName: "Doe",
            random: ()=> Math.floor(Math.random() *  10),
            pets : (args:{species:string}) => args.species ? pets.filter(p => p.species === args.species):pets
        }
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
