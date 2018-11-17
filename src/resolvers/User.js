import getUserId from '../utils/getUserId'
import prisma from '../prisma'

const User = {
  // email(parent, args, { request }, info) {
  //   const userId = getUserId(request, false)
  //   if (userId && userId === parent.id) {
  //     //risk: parent.id is depend on whether the query include id in selection
  //     return parent.email
  //   } else {
  //     return null
  //   }
  // },
  email: {
    // can return function or object
    fragment: 'fragment userId on User { id }',
    // fragment force to query this data even though client didn't ask for it
    // need extra configuration on server to support fragment
    // you need fragment if you need to access parent
    resolve(parent, args, { request }, info) {
      const userId = getUserId(request, false)
      if (userId && userId === parent.id) {
        return parent.email
      } else {
        return null
      }
    },
  },
  posts: {
    fragment: 'fragment userId on User { id }', // different use return different id
    resolve(parent, args, { request }, info) {
      return prisma.query.posts(
        {
          where: {
            //wehre by default use and logic operator
            published: true,

            author: {
              id: parent.id,
            },
          },
        },
        info
      )
    },
  },
}

export default User
