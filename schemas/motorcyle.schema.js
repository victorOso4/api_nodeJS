const Joi = require('joi');

const id = Joi.string()
const placa = Joi.string().min(5).max(6)
const brand = Joi.string().min(5).max(255)
const displacement = Joi.number()
const color = Joi.string().min(5).max(255)
const model = Joi.date()
const isExport = Joi.boolean()




const createMotoSchema = Joi.object({
    brand: brand.required(),
    placa: placa.required(),
    color: color.optional(),
    displacement: displacement.required(),
    model: model.required(),
    isExport: isExport.optional()
    

});

const updateMotoSchema = Joi.object({
    brand: brand.optional(),
    placa: placa.optional(),
    color: color.optional(),
    displacement: displacement.optional(),
    model: model.optional(),
    isExport: isExport.optional()

});

const getMotoSchema = Joi.object({
    id: id.required()
});

module.exports = {
    createMotoSchema,
    updateMotoSchema,
    getMotoSchema
}