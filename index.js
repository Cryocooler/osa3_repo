const http = require('http')
const express = require('express')
const app = express()
const cors = require('cors')
app.use(cors())
app.use(express.json())
app.use(express.static('build'))
var time = require('express-timestamp')
app.use(time.init)
const morgan = require('morgan')
//app.use(morgan("tiny"))

morgan.token('pb', (req, res) => {
  if(req.method === 'POST') return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :pb'))



let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]



app.get('/api/persons', (request,response) => {
  response.json(persons)
})


app.get('/info', (request, response) =>  {
  const personCount = persons.length
  response.send(`Phonebook has info for ${personCount} people 
  <br>${request.timestamp}</br>`)

})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const generateId = () => {
  // const maxId = persons.length > 0
  //   ? Math.max(...persons.map(n => n.id))
  //   : 0
  return Math.floor(Math.random() * (100-10) + 10)
}


//add new person

app.post('/api/persons', (request, response) => {
  const body = request.body
  //console.log('persons', persons.filter(person => person.name === body.name))

  
  if (!body.number || !body.name) {
    return response.status(400).json({ 
      error: 'name or number missing' 
    })

  } else if (persons.map(person => person.name).includes(body.name)) {
    return response.status(400).json({
      error: "name must be unique"
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId()
  }
  persons = persons.concat(person)

  response.json(person)
})



const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})