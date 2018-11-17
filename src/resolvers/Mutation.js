import bcrypt from 'bcryptjs'
import getUserId from '../utils/getUserId'
import generateToken from '../utils/generateJWT'
import hashPassword from '../utils/hashPassword'

// const token = jwt.sign({ id: 46 }, 'mysecret')
// const decoded = jwt.decode(token) //same as decoded2 but will not throw error because no verification on signature
// header(not encrypted) + body(not encrypted) + signature(encrypted)
// to prove that this data is come from this server
// const decoded2 = jwt.verify(token, 'mysecret')

const Mutation = {
  async createUser(parent, args, { prisma, request }, info) {
    // 2nd argument is salt, it add random character to every hash generation
    const password = await hashPassword(args.data.password)
    const user = await prisma.mutation.createUser({
      data: { ...args.data, password },
    }) //need more study on why removing info can return token
    //ok, got the answer in lecture 69
    //because what return from prisma is User, it has no user type in it
    //thus it is unable to map into the selection info

    return {
      user,
      token: generateToken(user.id),
    }
  },
  async login(parent, args, { prisma, request }, info) {
    const user = await prisma.query.user({ where: { email: args.data.email } })
    if (!user) {
      throw new Error('Unable to login')
    }
    const isMatch = await bcrypt.compare(args.data.password, user.password)
    if (!isMatch) {
      throw new Error('Unable to login')
    }

    return {
      user,
      token: generateToken(user.id),
    }
  },
  async deleteUser(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)
    const user = await prisma.mutation.deleteUser(
      { where: { id: userId } },
      info
    )

    return user
  },
  async updateUser(parent, args, { prisma, request }, info) {
    // can do without checking user exists, prisma do it automatically for you
    // if you want to use prisma exists, it allow you to customize your error message
    // but not using prisma exists is better because less request made
    const userId = getUserId(request)

    if (typeof args.data.password === 'string') {
      //password is null type if user doesn't update it
      args.data.password = await hashPassword(args.data.password)
    }

    return prisma.mutation.updateUser(
      { where: { id: userId }, data: args.data },
      info
    )
  },
  createPost(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)

    return prisma.mutation.createPost(
      //can return promise with or without async function
      {
        data: { ...args.data, author: { connect: { id: userId } } },
      },
      info
    )
  },
  async deletePost(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)
    const postExists = await prisma.exists.Post({
      // find post with id x AND belong to user x
      // use exists when you need to check condition
      // can use [post] to query, only one query to do all work
      id: args.id,
      author: {
        id: userId,
      },
    })

    if (!postExists) {
      throw new Error('Unable to delete post')
    }

    return prisma.mutation.deletePost(
      {
        where: { id: args.id },
      },
      info
    )
  },
  async updatePost(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)

    const postExists = await prisma.exists.Post({
      id: args.id,
      author: {
        id: userId,
      },
    })

    if (!postExists) {
      throw new Error('Unable to update post')
    }

    const isPublished = await prisma.exists.Post({
      id: args.id,
      published: true,
    })

    if (isPublished && args.data.published === false) {
      prisma.mutation.deleteManyComments({ where: { post: { id: args.id } } })
    }

    return prisma.mutation.updatePost(
      {
        where: { id: args.id },
        update: args.data,
      },
      info
    )
  },
  async createComment(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)

    const postExists = await prisma.exists.Post({
      // exist dont need where argument
      published: true,
      id: args.data.post,
    })
    if (!postExists) {
      throw new Error('Unable to find post')
    }

    return prisma.mutation.createComment(
      {
        data: {
          text: args.data.text,
          author: { connect: { id: userId } },
          post: { connect: { id: args.data.post } },
        },
      },
      info
    )
  },
  async deleteComment(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)
    const commentExists = await prisma.exists.Comment({
      id: args.id,
      author: {
        id: userId,
      },
    })

    if (!commentExists) {
      throw new Error('Unable to delete comment')
    }
    return prisma.mutation.deleteComment(
      {
        where: { id: args.id },
      },
      info
    )
  },
  async updateComment(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)
    const commentExists = await prisma.exists.Comment({
      id: args.id,
      author: {
        id: userId,
      },
    })

    if (!commentExists) {
      throw new Error('Unable to update comment')
    }
    return prisma.mutation.updateComment(
      {
        data: args.data,
        where: { id: args.id },
      },
      info
    )
  },
}

export default Mutation
