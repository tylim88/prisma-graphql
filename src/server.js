import { GraphQLServer, PubSub } from 'graphql-yoga'
import db from './db'
import prisma from './prisma' // run this file
import { resolvers, fragmentReplacements } from './resolvers/index'

const pubsub = new PubSub()

//resolver (server object)
const server = new GraphQLServer({
  typeDefs: './src/schema.graphql', //schema path must relative to root directory
  resolvers,
  context: request => ({
    //if context is function, it has req as arguement
    db,
    pubsub,
    prisma,
    request,
  }),
  fragmentReplacements,
})

export default server
