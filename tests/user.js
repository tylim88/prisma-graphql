import 'cross-fetch/polyfill' //access to fetch api in node js, apollo boost use fetch api
import prisma from '../src/prisma'
import seedDatabase, { userOne } from './utils/seedDatabase'
import getClient from './utils/getClient'
import { createUser, login, getUsers, getProfile } from './utils/operations'

const client = getClient()

beforeEach(seedDatabase)

test('Should create a new user', async () => {
  jest.setTimeout(100000)

  const variables = {
    //give value to graphql variables
    data: {
      name: 'tylim',
      email: 'tylim@gmail.com',
      password: '12345678',
    },
  }

  const response = await client.mutate({
    mutation: createUser,
    variables,
  })

  const userExist = await prisma.exists.User({
    id: response.data.createUser.user.id,
  })
  expect(userExist).toBe(true)
})

test('Should expose public author profiles', async () => {
  const response = await client.query({ query: getUsers })

  expect(response.data.users.length).toBe(1)
  expect(response.data.users[0].email).toBe(null)
  expect(response.data.users[0].name).toBe('Jen')
})

test('Should not login with bad credentials', async () => {
  const variables = {
    data: {
      email: 'jen@gmail.com',
      password: 'sdhshdzdsdhzhd',
    },
  }

  await expect(client.mutate({ mutation: login, variables })).rejects.toThrow()
  //expect the rejected to throw error
  // need await or else will pass without asserting

  // expect(() => {
  //   throw new Error('error')
  // }).toThrow()
  //expect accept function and value
})

test('Should not signUp user with invalid password', async () => {
  const variables = {
    data: { name: 'jeff', email: 'jeff@gmail.com', password: '123' },
  }

  await expect(
    client.mutate({ mutation: createUser, variables })
  ).rejects.toThrow()
})

test('Should fetch user profile', async () => {
  const client = getClient(userOne.jwt)

  const { data } = await client.query({ query: getProfile })
  expect(data.me.id).toBe(userOne.user.id)
  expect(data.me.name).toBe(userOne.user.name)
  expect(data.me.email).toBe(userOne.user.email)
})
