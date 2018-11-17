import { extractFragmentReplacements } from 'prisma-binding'
import Query from './Query'
import Mutation from './Mutation'
import Post from './Post'
import User from './User'
import Comment from './Comment'
import Subscription from './Subscription'

//the reason to create this file is to prevent recursive import between src/index.js and prisma.js

const resolvers = {
  Query,
  Mutation,
  Post,
  Comment,
  User,
  Subscription,
}

const fragmentReplacements = extractFragmentReplacements(resolvers) //create fragment replacement for all resolver

export { resolvers, fragmentReplacements }
