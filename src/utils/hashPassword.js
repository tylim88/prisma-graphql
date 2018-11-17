import bcrypt from 'bcryptjs'

const hashPassword = password => {
  if (password.length < 8) {
    throw new Error('Password must be 8 character or longer')
  }

  return bcrypt.hash(password, 10)
} // 2nd argument is salt, it add random character to every hash generation

export default hashPassword
