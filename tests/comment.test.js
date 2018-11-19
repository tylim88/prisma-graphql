import 'cross-fetch/polyfill' //access to fetch api in node js, apollo boost use fetch api
import prisma from '../src/prisma'
import seedDatabase, {
  userOne,
  commentOne,
  commentTwo,
  postOne,
} from './utils/seedDatabase'
import getClient from './utils/getClient'
import { subscribeToComments, deleteComment } from './utils/operations'

beforeEach(seedDatabase)
const client = getClient()

// test('Should delete own comment', async () => {
//   const client = getClient(userOne.jwt)
//   const variables = {
//     id: commentOne.comment.id,
//   }
//   await client.mutate({ mutation: deleteComment, variables })

//   const commentExist = await prisma.exists.Comment({
//     id: commentOne.comment.id,
//   })

//   expect(commentExist).toBe(false)
// })

// test('Should not able to delete others comment', async () => {
//   const client = getClient(userOne.jwt)
//   const variables = {
//     id: commentTwo.comment.id,
//   }

//   expect(
//     client.mutate({ mutation: deleteComment, variables })
//   ).rejects.toThrow() //toThrowError() also can
// })

test('Should subscribe to comment for a post', async done => {
  const variables = { postId: postOne.post.id }

  client.subscribe({ query: subscribeToComments, variables }).subscribe({
    //subscribe is not promise because promise resolve into single value
    //while subscribe sending value from time to time

    next(response) {
      //fire this callback function every time post change
      //however note that this is still an async function so jest simply run through this
      expect(response.data.comment.mutation).toBe('DELETED')
      done() //calling done argument (argument name can be any), tell the test only to stop(or timeout) after done is called
    },
  })

  //change a comment to fire next()
  await prisma.mutation.deleteComment({ where: { id: commentOne.comment.id } })
})
