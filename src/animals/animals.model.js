import mongoose, { Schema } from "mongoose";

const animalSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    keeper: {
        type: Schema.ObjectId, //type: mongoose.Schema.Types.ObjectId,                   //ref: 'Course',
        unique: true,
        required: true,
        ref: 'user'
    }
})

export default mongoose.model('animal', animalSchema)
