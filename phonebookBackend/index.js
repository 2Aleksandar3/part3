const http = require('http')
const express = require('express')
const morgan=require('morgan')
const app = express()
const cors = require('cors')

app.use(cors())

app.use(express.json())

app.use(express.static('dist'))

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
 
morgan.token('body', (req) => JSON.stringify(req.body))

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.post('/api/persons', (request, response) => {
  const body = request.body
  if (!body.name) {
    return response.status(400).json({ 
      error: 'name missing' 
    })
  }
  if (!body.number) {
    return response.status(400).json({ 
      error: 'number missing' 
    })
  }
  for (let i = 0; i < persons.length; i++){
    
    if(persons[i].name===body.name){
      return response.status(400).json({ 
        error: 'name already exists' 
      })
    }
  }
  
  const people = {
    name: body.name,
    number: body.number,
    id: Math.floor(Math.random() * (99999 - persons.length + 1)) + persons.length,
  }
  
  console.log(people.id)
  console.log(people)
  persons=persons.concat(people)
  response.json(people)
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/info', (request, response) => {
  var date = new Date()
  console.log(date)
  console.log(persons.length)
    response.send(`<p>Phonebook has info for ${persons.length} people <br/>${date}</p>`)
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
    persons = persons.filter(persons => persons.id !== id)
  
    response.status(204).end()
  })

  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })


