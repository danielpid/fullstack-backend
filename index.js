const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const {requestLogger} = require('./requestLogger')
const cors = require('cors')

app.use(cors())
app.use(requestLogger)
app.use(bodyParser.json())
app.use(requestLogger)

let notes = [
    {
        id: 1,
        content: "HTML is easy",
        date: "2019-05-30T17:30:31.098Z",
        important: true
    },
    {
        id: 2,
        content: "Browser can execute only Javascript",
        date: "2019-05-30T18:39:34.091Z",
        important: false
    },
    {
        id: 3,
        content: "GET and POST are the most important methods of HTTP protocol",
        date: "2019-05-30T19:20:14.298Z",
        important: true
    }
]

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

app.get('/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    const note = notes.find(n => n.id === id)
    if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
})

app.get('/notes', (request, reponse) => {
    reponse.json(notes)
})

const generateId = () => notes.length > 0 ?
    Math.max(...notes.map(n => n.id)) + 1 : 1

app.post('/notes', (request, response) => {
    const body = request.body
    if (!body.content) {
        return response.status(400).json({
            error: "Content missing"
        })
    }
    const {content, important} = body
    const note = {
        id: generateId(),
        content,
        important: important || false,
        data: new Date()
    }
    notes = notes.concat(note)
    response.json(note)
})

app.delete('/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    notes = notes.filter(n => n.id !== id)
    response.status(204).end()
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'Unknown endpoint' })
  }
  
app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)