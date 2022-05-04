import express from 'express'
import { graphqlHTTP } from 'express-graphql'
import { buildSchema } from 'graphql'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()


let schema = buildSchema(`
scalar DateTime

type Query {
    user(id:Int!):User
}

type Mutation {
    createUser(name:String!, email:String!):User
}

type Post {
    id:        Int!
    createdAt: DateTime!
    updatedAt: DateTime!
    title:     String!
    content:   String
    published: Boolean!
    author:    User!
    authorId:  Int!
  }
  
  type Profile {
    id:     Int!
    bio:    String!
    user:   User!
    userId: Int!
  }
  
  type User {
    id:      Int!
    email:   String!
    name:    String
    posts:   [Post!]
    profile: Profile
  }
`)


let root = {
    user: async (args:{id:number})=> {
        const user = await prisma.user.findUnique({
            where:{
                id: args.id
            }
        })
        console.log(user);
        return user
        
    },
    createUser: async (args:{name:string, email:string})=>{
        const createdUser = await prisma.user.create({
            data:{
                name:args.name,
                email: args.email,
                posts:{
                    create: {title:"The end is near"}
                },
                profile:{
                    create:{bio:"Coffee is good"}
                }
            }
        })
        return createdUser
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
