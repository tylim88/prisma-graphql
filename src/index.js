import '@babel/polyfill/noConflict'
//import this before any code, noConflict prevent double loading from babel-node
//it is part of babel node, we need this because babel node is not good for production
import server from './server'

server.start({ port: process.env.PORT || 4000 }, () => {
  //default port is 4000
  console.log('The server is up')
})
