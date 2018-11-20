import 'cross-fetch/polyfill' //access to fetch api in node js, apollo boost use fetch api
import prisma from '../src/prisma'
import seedDatabase, { userOne, postOne, postTwo } from './utils/seedDatabase'
import getClient from './utils/getClient'
import {
  getPosts,
  myPosts,
  updatePost,
  createPost,
  deletePost,
  subscribeToPosts,
} from './utils/operations'

const client = getClient()

beforeEach(seedDatabase)

// test('Should get published post', async () => {
//   const response = await client.query({ query: getPosts })

//   expect(response.data.posts.length).toBe(1)
//   expect(response.data.posts[0].published).toBe(true)
// })

// test('Should fetch user posts', async () => {
//   const client = getClient(userOne.jwt)

//   const { data } = await client.query({ query: myPosts })

//   expect(data.myPosts.length).toBe(2)
// })

// test('Should be able to update own post', async () => {
//   const client = getClient(userOne.jwt)

//   const variables = { id: postOne.post.id, data: { published: false } }

//   const { data } = await client.mutate({ mutation: updatePost, variables })

//   const exists = await prisma.exists.Post({
//     id: postOne.post.id,
//     published: false,
//   })
//   expect(data.updatePost.published).toBe(false) //look at respond
//   expect(exists).toBe(true) //look at database
// })
// test('Should create a new post', async () => {
//   const client = getClient(userOne.jwt)

//   const variables = {
//     data: { title: '3rd post', body: 'test create post', published: false },
//   }

//   const { data } = await client.mutate({ mutation: createPost, variables })
//   const exists = await prisma.exists.Post({
//     id: data.createPost.id,
//     title: '3rd post',
//     body: 'test create post',
//     published: false,
//   })
//   expect(data.createPost.title).toBe('3rd post') //look at respond
//   expect(exists).toBe(true) //look at database
// })

// test('Should delete a post', async () => {
//   const client = getClient(userOne.jwt)

//   const variables = { id: postTwo.post.id }

//   const { data } = await client.mutate({ mutation: deletePost, variables })

//   const exists = await prisma.exists.Post({
//     id: postTwo.post.id,
//   })
//   expect(data.deletePost.id).toBe(postTwo.post.id) //look at respond
//   expect(exists).toBe(false) //look at database
// })

test('Should subscribe to a post', async done => {
  client.subscribe({ query: subscribeToPosts }).subscribe({
    //subscribe is not promise because promise resolve into single value
    //while subscribe sending value from time to time

    next(response) {
      //fire this callback function every time post change
      //however note that this is still an async function so jest simply run through this
      expect(response.data.post.mutation).toBe('DELETED')
      done() //calling done argument (argument name can be any), tell the test only to stop(or timeout) after done is called
    },
  })

  //change a post to fire next()
  //using prisma allow us to run purer test because we dont nee to worry about prisma code
  await prisma.mutation.deletePost({ where: { id: postOne.post.id } })
})
