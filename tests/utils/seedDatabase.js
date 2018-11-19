import prisma from '../../src/prisma'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const userOne = {
  //the reason create object is because they are reference, the value change globally when ever seedDatabase run
  input: {
    name: 'Jen',
    email: 'jen@gmail.com',
    password: bcrypt.hashSync('987654321'),
  },
  user: undefined,
  jwt: undefined,
}

const userTwo = {
  input: {
    name: 'Sarah',
    email: 'sarah@gmail.com',
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

const commentOne = {
  input: {
    text: "Jen's Comment",
  },
  comment: undefined,
}

const commentTwo = {
  input: {
    text: "Sarah's Comment",
  },
  comment: undefined,
}

const seedDatabase = async () => {
  jest.setTimeout(100000)
  //delete test data
  await prisma.mutation.deleteManyComments()
  await prisma.mutation.deleteManyPosts()
  await prisma.mutation.deleteManyUsers()

  //create one user
  userOne.user = await prisma.mutation.createUser({
    data: userOne.input, //hashSync return value and will not return promise
  })

  userOne.jwt = jwt.sign({ userId: userOne.user.id }, process.env.JWT_SECRET) //need to sign token here because token is not generated on prisma side

  //create second user
  userTwo.user = await prisma.mutation.createUser({
    data: userTwo.input,
  })

  userTwo.jwt = jwt.sign({ userId: userTwo.user.id }, process.env.JWT_SECRET)

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

  //create post two
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
  // create comment 1
  commentOne.comment = await prisma.mutation.createComment({
    data: {
      ...commentOne.input,
      author: {
        connect: {
          id: userOne.user.id,
        },
      },
      post: {
        connect: {
          id: postOne.post.id,
        },
      },
    },
  })

  // create comment 2
  commentTwo.comment = await prisma.mutation.createComment({
    data: {
      ...commentTwo.input,
      author: {
        connect: {
          id: userTwo.user.id,
        },
      },
      post: {
        connect: {
          id: postOne.post.id,
        },
      },
    },
  })
}

export {
  seedDatabase as default,
  userOne,
  postOne,
  postTwo,
  userTwo,
  commentOne,
  commentTwo,
}
