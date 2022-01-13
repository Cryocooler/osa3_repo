const mongoose = require('mongoose')


const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url =
`mongodb://sahin:${password}@cluster0-shard-00-00.6ikye.mongodb.net:27017,cluster0-shard-00-01.6ikye.mongodb.net:27017,cluster0-shard-00-02.6ikye.mongodb.net:27017/Phonebook?ssl=true&replicaSet=atlas-13m5bq-shard-0&authSource=admin&retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
  name: `${name}`,
  number: `${number}`
})

if (process.argv.length > 3) {
  person.save().then(res => {
    console.log(`Added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })

} else {
  Person.find({}).then(res => {
    res.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })


}
