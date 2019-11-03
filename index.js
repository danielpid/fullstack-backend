require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const { logger } = require('./middleware/requestLogger')
const { errorHandler } = require('./middleware/errorHandler')
const cors = require('cors')
const Note = require('./models/note')

app.use(cors())
app.use(bodyParser.json())
app.use(logger)


app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

app.get('/notes/:id', (request, response, next) => {
    Note.findById(request.params.id)
        .then(note => {
            if (note) {
                response.json(note.toJSON())
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.get('/notes', (request, reponse) => {
    Note.find({})
        .then(notes => {
            reponse.json(notes.map(note => note.toJSON()))
        })

})

app.post('/notes', (request, response) => {
    const body = request.body
    if (!body.content) {
        return response.status(400).json({
            error: "Content missing"
        })
    }
    const { content, important } = body
    const note = new Note({
        content,
        important: important || false,
        date: new Date()
    })
    note.save()
        .then(result => {
            response.json(result.toJSON())
        })
        .catch(error => console.error('error saving', error))
})

app.put('/notes/:id', (request, response, next) => {
    const body = request.body

    const note = {
        content: body.content,
        important: body.important,
    }

    Note.findByIdAndUpdate(request.params.id, note, { new: true })
        .then(updatedNote => {
            response.json(updatedNote.toJSON())
        })
        .catch(error => next(error))
})

app.delete('/notes/:id', (request, response, next) => {
    Note.findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'Unknown endpoint' })
}

app.use(unknownEndpoint)

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT)
console.log(`Server running on port ${PORT}`)