const Joi = require('joi');

const id = Joi.number()
const placa = Joi.string().min(5).max(6)
const brand = Joi.string().min(5).max(255)
const displacement = Joi.number()
const color = Joi.string().min(5).max(255)
const model = Joi.number()



const createMotoSchema = Joi.object({
    brand: brand.required(),
    placa: placa.required(),
    color: color.optional(),
    displacement: displacement.required(),
    model: model.required()
});

const updateMotoSchema = Joi.object({
    brand: brand.optional(),
    placa: placa.optional(),
    color: color.optional(),
    displacement: displacement.optional(),
    model: model.optional(),
});

const getMotoSchema = Joi.object({
    id: id.required()
});

module.exports = {
    createMotoSchema,
    updateMotoSchema,
    getMotoSchema
}