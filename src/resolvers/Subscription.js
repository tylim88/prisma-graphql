import getUserId from '../utils/getUserId'

const Subscription = {
  comment: {
    subscribe(parent, { postId }, { prisma }, info) {
      //data flow
      // prisma ->(data1) node ->(data2) client (graphql playground)
      // data1 and data2 need to be align
      return prisma.subscription.comment(
        {
          where: {
            //subscribe to what kind of comment or comment mutation
            node: {
              post: { id: postId }, //this mean that we subscribe to all comments belong to this post
            },
          },
        },
        info
      )
    },
  },
  post: {
    subscribe: (parent, { postId }, { prisma }, info) => {
      return prisma.subscription.post(
        {
          where: {
            node: { published: true },
          },
        },
        info
      )
    },
  },
  myPost: {
    subscribe: (parent, { postId }, { prisma, request }, info) => {
      const userId = getUserId(request)
      return prisma.subscription.post(
        {
          where: {
            node: { author: { id: userId } },
          },
        },
        info
      )
    },
  },
}
export default Subscription
