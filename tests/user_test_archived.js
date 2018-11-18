import { getFirstName, isValidPassword } from '../src/utils/user'

test('should return first name when given full name', () => {
  const firstName = getFirstName('ty lim')

  expect(firstName).toBe('ty') //tobe compare value

  //if this callback function throw error, test fail
  // if (firstName !== 'ty') {
  //   throw new Error('Expected the string ty')
  // }
  //use expert assertion instead
})

test('Should return first name when given first name', () => {
  const firstName = getFirstName('Ken')
  expect(firstName).toBe('Ken')
})

test('Should reject password shorter than 8 characters', () => {
  const isValid = isValidPassword('1234')
  expect(isValid).toBe(false)
})

test('Should reject password than contains word password', () => {
  const isValid = isValidPassword('1password1')
  expect(isValid).toBe(false)
})

test('Should reject password than contains word password', () => {
  const isValid = isValidPassword('1pass222word1')
  expect(isValid).toBe(true)
})
