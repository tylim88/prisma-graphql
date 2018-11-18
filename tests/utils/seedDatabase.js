import prisma from '../../src/prisma'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const userOne = {
  input: {
    name: 'Jen',
    email: 'jen@gmail.com',
    password: bcrypt.hashSync('987654321'),
  },
  user: undefined,
  jwt: undefined,
}

const postOne = {
  input: {
    title: 'test published post',
    body: "this is Jen's published post",
    published: true,
  },
  post: undefined,
}

const postTwo = {
  input: {
    title: 'test draft post',
    body: "this is Jen's draft post",
    published: false,
  },
  post: undefined,
}

const seedDatabase = async () => {
  jest.setTimeout(100000)
  //delete test data
  await prisma.mutation.deleteManyPosts()
  await prisma.mutation.deleteManyUsers()

  //create one user
  userOne.user = await prisma.mutation.createUser({
    data: userOne.input, //hashSync return value and will not return promise
  })

  userOne.jwt = jwt.sign({ userId: userOne.user.id }, process.env.JWT_SECRET) //need to sign token here because token is not generated on prisma side

  //create post one
  postOne.post = await prisma.mutation.createPost({
    data: {
      ...postOne.input,
      author: {
        connect: {
          id: userOne.user.id,
        },
      },
    },
  })
  //create post twpo
  postTwo.post = await prisma.mutation.createPost({
    data: {
      ...postTwo.input,
      author: {
        connect: {
          id: userOne.user.id,
        },
      },
    },
  })
}

export { seedDatabase as default, userOne, postOne, postTwo }
