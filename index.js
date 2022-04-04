const { request } = require("express")
require('dotenv').config()
const express = require("express")
const { status } = require("express/lib/response")
const app = express()
const morgan = require("morgan")
const cors = require("cors")
const Person = require("./models/person")

app.use(express.json())
app.use(morgan('tiny'))

app.use(cors())

app.use(express.static('build'))


// app.get('/info', (request, response) => {
//     const noOfPple = persons.length
//     const time = new Date()
//     response.send(`
//     <p>Phonebook has info for ${noOfPple} people.</p>
//     <p>${time}</p>
//     `)
// })



app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
        response.json(person)
    })
})

// app.delete('/api/persons/:id', (request, response) => {
//     const id = Number(request.params.id)
//     persons = persons.filter(person => person.id !== id)
//     response.status(204).end()
// })


morgan.token('postLog', (req, res) => {
    return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postLog'))

app.post('/api/persons/', (request, response) => {
    const body = request.body

    if (body.name === undefined || body.number === undefined){
        return response.status(400).json({error:'Content missing'})
    } 
    // else {
    //     Person.find({}).then(p => {
    //         if(p.name === body.name) {
    //             return response.status(400).json({error:'Name must be unique'})
    //         } 
    //     })
    // }
    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
    
})


const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server Running on port ${PORT}`)
})