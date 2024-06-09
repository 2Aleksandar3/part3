const http = require('http')
const express = require('express')
const morgan=require('morgan')
const app = express()
const cors = require('cors')
const Person= require('./models/people')
require('dotenv').config()

app.use(cors())

app.use(express.json())

app.use(express.static('dist'))


 



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
  /*for (let i = 0; i < Person.length; i++){
    
    if(Person[i].name===body.name){
      return response.status(400).json({ 
        error: 'name already exists' 
      })
    }
  }*/
  
  const people =new Person( {
    name: body.name,
    number: body.number,
    id: Math.floor(Math.random() * (99999 - Person.length + 1)) + Person.length,
  })
  
  console.log(people.id,'people id in backend post')
  console.log(people,'people list in backend post')
  people.save().then(savedPerson => {
    console.log(savedPerson,'saved person in backend post')
    response.json(savedPerson)
  })
})

app.get('/api/persons', (request, response) => {
  
  Person.find({}).then(persons=>{
    
      response.json(persons)  
    
})
})

app.get('/info', (request, response) => {
  var date = new Date()
  console.log(date)
  console.log(Person.length)
    response.send(`<p>Phonebook has info for ${Person.length--} people <br/>${date}</p>`)
  })
  
  /*app.get('/api/persons/:id', (request, response,next) => {
    Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
  })*/
  
  /*app.delete('/api/persons/:id', (request, response,next) => {
    Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
    
  })*/

  const PORT = process.env.PORT 
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })

  app.get('/api/persons/:id', (request, response,next) => {
    Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
  })

  app.delete('/api/persons/:id', (request, response,next) => {
    Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
    
  })

  const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } 
  
    next(error)
  }
  
  
  app.use(errorHandler)