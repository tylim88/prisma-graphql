import getUserId from '../utils/getUserId'

// greeting(parent, args, { db, prisma }, info) {
//   //args store argument
//   return `Hello ${(args.position ? args.position : '') +
//     (args.name ? args.name : '')}!`
// },
// grades(parent, args, { db, prisma }, info) {
//   return [99, 80, 93]
// },
// add(parent, args, { db, prisma }, info) {
//   return args.numbers.length
//     ? args.numbers.reduce((acc, currentValue) => acc + currentValue)
//     : 0
// },

const Query = {
  me: async (parent, args, { prisma, request }, info) => {
    const userId = getUserId(request)

    const user = await prisma.query.user({ where: { id: userId } }, info)

    return user
  },
  post: async (parent, args, { prisma, request }, info) => {
    const userId = getUserId(request, false)

    const posts = await prisma.query.posts(
      {
        where: {
          id: args.id,
          OR: [{ published: true }, { author: { id: userId } }], //if userId is undefined,it will match anything, if it is not null, it will not match anything
        },
      },
      info
    )

    if (posts.length === 0) {
      throw new Error('Post not found')
    }

    return posts[0]
  },
  users: (parent, args, { prisma, request }, info) => {
    //resolver will wait for promise to resolved

    const opArgs = {
      first: args.first, //pagination, fetch how many
      skip: args.skip, //skip how many
      after: args.after, //fetch after id x
      orderBy: args.orderBy, //ascending or descending order
    }

    if (args.query) {
      opArgs.where = {
        OR: [{ name_contains: args.query }], //if name contain, do not let people search by email
      }
    }

    return prisma.query.users(opArgs, info)

    // 2nd argument for query
    // if null/undefined/empty return everything except non-scalar data
    // if string, it is like grpahql query
    // if object, it is from info object, it is what client pass in query, it is useful because we cannot decide on what client pass in, it return everything including the non scalar
  },
  posts: (parent, args, { prisma, request }, info) => {
    const opArgs = {
      where: {
        published: true,
      },
      first: args.first, //pagination
      skip: args.skip,
      after: args.after,
      orderBy: args.orderBy,
    }

    if (args.query) {
      opArgs.where.OR = [
        { title_contains: args.query },
        { body_contains: args.query },
      ] //if name contain OR email contain
    }

    //too bad cant only do case sensitive comparison

    return prisma.query.posts(opArgs, info)
  },
  myPosts: (parent, args, { prisma, request }, info) => {
    const userId = getUserId(request)
    const opArgs = {
      where: {
        author: { id: userId },
      },
      first: args.first,
      skip: args.skip,
      after: args.after,
      orderBy: args.orderBy,
    }

    if (args.query) {
      opArgs.where.OR = [
        { title_contains: args.query },
        { body_contains: args.query },
      ]
    }

    return prisma.query.posts(opArgs, info)
  },
  comments: (parent, args, { prisma, request }, info) => {
    const opArgs = {
      first: args.first,
      skip: args.skip,
      after: args.after,
      orderBy: args.orderBy,
    }

    return prisma.query.comments(opArgs, info)
    // if (!args.query) {
    //   return db.comments
    // }
    // return db.comments.filter(comment => {
    //   return (
    //     comment.id.toLowerCase().includes(args.query.toLowerCase()) ||
    //     comment.text.toLowerCase().includes(args.query.toLowerCase())
    //   )
    // })
  },
}

export default Query
