//this exported function will run after all tests finish

module.exports = async () => {
  await global.httpServer.close()
}
