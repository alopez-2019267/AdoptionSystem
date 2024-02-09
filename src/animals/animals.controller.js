'use strict'

import Animal from './animals.model.js'


export const test = (req, res) =>{
    console.log('test is running')
    return res.send({message: 'Test is running'})
}

export const registrarAnimal = async(req, res) =>{
    try{
        let data = req.body
        let animal = new Animal(data)
        await animal.save()
        return res.send({message: `Se registro el animal`})
    }catch(err){
        console.log(err)
        return res.status(500).send({message: 'Error registering an Animal'})
    }
}

export const getAnimals = async(req) =>{
    try{
        return res.send({message: })
    }catch(err){
        console.log(err)
        return res.status
    }
}


//return