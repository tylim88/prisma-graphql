require('babel-register')
require('@babel/polyfill/noConflict')
//import this to use babel for code in server.js, need to import it on top entry point, just like dotenv
//this exported function will run before all tests finish

const server = require('../../src/server').default //get default from server.js export

module.exports = async () => {
  global.httpServer = await server.start({ ports: 4000 }) //global variable
} //globalSetup and globalTeardown is not processed with babel, weird
