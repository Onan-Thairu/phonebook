// Helper script

const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password> <optional>')
    process.exit(1)
} else if (process.argv.length === 3) {
    const password = process.argv[2]

    const url = `mongodb+srv://fStack${password}@cluster0.7rmdo.mongodb.net/phonebookApp?retryWrites=true&w=majority`

    mongoose.connect(url)

    const personSchema = new mongoose.Schema({
        name: String,
        number: Number,
    })

    const People = mongoose.model('People', personSchema)

    People
        .find({})
        .then(result => {
            result.forEach(person => console.log(person))
            mongoose.connection.close()
        })

} else {
    const password = process.argv[2]

    const url = `mongodb+srv://fStack:${password}@cluster0.7rmdo.mongodb.net/phonebookApp?retryWrites=true&w=majority`

    mongoose.connect(url)

    const personSchema = new mongoose.Schema({
        name: String,
        number: Number,
    })

    const Person = mongoose.model('Person', personSchema)

    const argName = process.argv[3]
    const argNumber = process.argv[4]

    const person = new Person({
        name: argName,
        number: argNumber,
    })

    person.save().then(result => {
        console.log(`Added ${argName} - Number: ${argNumber} to Phonebook`)
        mongoose.connection.close()
    })

}