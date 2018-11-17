import jwt from 'jsonwebtoken'

const getUserId = (request, requireAuth = true) => {
  const header = request.request
    ? request.request.headers.authorization // why there is 2 request? because in request there is request and response
    : request.connection.context.Authorization //web socket for subscription
  if (header) {
    const token = header.replace('Bearer ', '') // or use header.split(' ')
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    return decoded.userId
  }
  if (requireAuth) {
    throw new Error('Authentication required')
  }

  return null
}

export default getUserId
