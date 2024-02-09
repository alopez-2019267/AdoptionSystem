import express from 'express'
import { test, registrarAnimal, getAnimals } from './animals.controller.js'

const api = express.Router()

api.get('/test', test)
api.post('/getAnimals', getAnimals)
api.post('/registrarAnimal', registrarAnimal)
export default api