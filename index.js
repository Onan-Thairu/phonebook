const { request } = require('express')
require('dotenv').config()
const express = require('express')
const { status } = require('express/lib/response')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(express.static('build'))
app.use(express.json())
app.use(morgan('tiny'))

app.use(cors())


app.get('/info', (request, response) => {
    Person.find({}).then(result => {
        const noOfPple = result.length
        const time = new Date()
        response.send(`
        <p>Phonebook has info for ${noOfPple} people.</p>
        <p>${time}</p>
        `)
    })
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        return response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(returnedPerson => {
            if (returnedPerson) {
                response.json(returnedPerson)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})


morgan.token('postLog', (req, res) => {
    return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postLog'))

app.post('/api/persons/', (request, response, next) => {
    const body = request.body

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save()
        .then(savedPerson => {
            response.json(savedPerson)
        })
        .catch(error => {
            next(error)
        })

})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body

    const person = {
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(request.params.id, person, { new: true })
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))
})


const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error:'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).send('Validation error')
    }

    next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server Running on port ${PORT}`)
})