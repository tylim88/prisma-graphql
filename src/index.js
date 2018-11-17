import '@babel/polyfill/noConflict' //import this before any code, noConflict prevent double loading from babel-node
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

server.start({ port: process.env.PORT || 4000 }, () => {
  //default port is 4000
  console.log('The server is up')
})
