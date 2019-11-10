const Note = require('../models/note')
const User = require('../models/user')

const initialNotes = [
  {
    content: 'HTML is easy',
    important: false
  },
  {
    content: 'Browser can execute only Javascript',
    important: true
  }
]

const initialUser = {
  notes: [],
  username: 'danielpid',
  name: 'Daniel Pinillos',
  password: 'danielpid'
}

const nonExistingId = async () => {
  const note = new Note({ content: 'willremovethissoon' })
  await note.save()
  await note.remove()

  return note._id.toString()
}

const notesInDb = async () => {
  const notes = await Note.find({}).populate('user', { username: 1, name: 1 })
  return notes.map(note => note.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

const userInDb = async () => {
  const users = await User.find({})
  return users[0].toJSON()
}

module.exports = {
  initialNotes,
  nonExistingId,
  notesInDb,
  userInDb,
  usersInDb,
  initialUser
}