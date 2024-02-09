'use strict'

import User from './user.model.js'
import { encrypt, checkPassword, checkUpdate } from '../utils/validator.js'

export const test =(req, res)=>{
    console.log('test is running')
    return res.send({message: 'Test is running'})
}

export const register = async(req, res) => {
    try{
        //Capturar el formulario (body)
        let data = req.body
        console.log(data)
        //Encriptar la constraseña 
        data.password = await encrypt(data.password)
        //Asignar el rol por defecto 
        data.role = 'CLIENT'
        //Guardar la información en la DB
        let user = new User(data)
        await user.save()
        //Responder al usuario  
        return res.send({message: `Register successfully, can be logged with email use ${user.username}`})
    }catch(err){    
        console.log(err)
        return res.status(500).send({message: 'Error registering user', err: err})
    }
}

export const login = async(req, res)=>{
    try{
        //Capturar los datos (body)
        let { username, password } = req.body
        //Validar que el usuario exista
        let user = await User.findOne({username}) //buscar un solo registro. username: 'jmolina'
        //Verificar que la contraseña coincida
        if(user && await checkPassword(password, user.password)){
            let loggedUser = {
                username: user.username,
                name: user.name,
                role: user.role
            }
            return res.send({message: `Welcome ${loggedUser.name}`, loggedUser})
        }
        //Responde al usuario
        return res.status(404).send({message: 'Invalid credentials'})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error to login'})
    }
}

export const update = async(req, res)=>{//datos generales (no password)
    try{
        //Obtener el id del usuario a actualizar
        let { id } = req.params
        //Obtener los datos a actualizar
        let data = req.body
        //Validar si data trae dato
        let update = checkUpdate(data, id)
        if(!update) return res.status(400).send({message: 'Have submitted some data that cannot be updated or missing data'})
        //Validar si tiene permisos (tokenización) X Hoy No Lo Vemos X
        //Actualizar(BD)
        let updatedUser = await User.findOneAndUpdate(
            { _id: id}, //ObjectsId <- hexadecimales (Hora sistema, Version Mongo, Llave privada)
            data,
            {new: true} //los datos que se van a actualizar
        )
        //Validar la actualización
        if(!updatedUser) return res.status(401).send({message: 'User not found and not updated'})

        //Respondo al usuario
        return res.send({message: 'Updated User', updatedUser})
    }catch(err){
        console.error(err)
        if(err.keyValue.username) return res.status(400).send({message: `Username ${err.keyValue.username} is already exists`})
        return res.status(500).send({message: 'Error updating acount'})
    }
}

export const deleteU = async(req,res)=>{
    try{
        //Obtener el id
        let { id } = req.params
        //Validar si esta logeado y es el mismo X No lo vemos hoy X
        //Eliminar (deleteOne(solo elimina no devuelve el documento) / findOneAndDelete (Me devuelve el docuemnto eliminado))
        let deletedUser = await User.findOneAndDelete({_id: id})
        //Verificar que se elimino
        if(!deletedUser) return res.status(404).send({message: 'Account not found and not deleted'})
        //Responder
        return res.send({message: `Account with username ${deletedUser.username} deleted successfully`}) //status 200
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error deleting account'})
    }
}