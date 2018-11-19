import 'cross-fetch/polyfill' //access to fetch api in node js, apollo boost use fetch api
import prisma from '../src/prisma'
import seedDatabase, {
  userOne,
  commentOne,
  commentTwo,
} from './utils/seedDatabase'
import getClient from './utils/getClient'
import { deleteComment } from './utils/operations'

beforeEach(seedDatabase)

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

test('Should not able to delete others comment', async () => {
  const client = getClient(userOne.jwt)
  const variables = {
    id: commentTwo.comment.id,
  }

  expect(
    client.mutate({ mutation: deleteComment, variables })
  ).rejects.toThrow() //toThrowError() also can
})
