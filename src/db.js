const users = [
  {
    id: '1',
    name: 'Andrew',
    email: 'andrei@example.com',
    age: 27,
  },
  {
    id: '2',
    name: 'Sarah',
    email: 'sarah@example.com',
  },
  {
    id: '3',
    name: 'Mike',
    email: 'mike@example.com',
  },
]

const posts = [
  {
    id: '1',
    title: 'haha',
    body: 'dog',
    published: true,
    author: '1',
  },
  {
    id: '2',
    title: 'hihi',
    body: 'cat',
    published: false,
    author: '1',
  },
  {
    id: '3',
    title: 'hoho',
    body: 'rabbit',
    published: true,
    author: '2',
  },
]

const comments = [
  {
    id: '1',
    text: 'hmmm',
    author: '2',
    post: '2',
  },
  {
    id: '2',
    text: 'naruhoto',
    author: '1',
    post: '1',
  },
  {
    id: '3',
    text: 'so desu ne',
    author: '1',
    post: '2',
  },
  {
    id: '4',
    text: 'lmao',
    author: '2',
    post: '1',
  },
]

const db = { users, posts, comments }

export default db
