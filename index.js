// Librerías externas
// Librerías externas
const express = require('express');
// const app = require('express').Router();
const { validatorHandler } = require('./middlewares/validator.handler');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { createMotoSchema, updateMotoSchema, getMotoSchema } = require('./schemas/motorcyle.schema');
// Módulos internos
const { readFile, writeFile } = require('./src/files');

// const app = express();
const FILE_NAME = './db/motorcycle.txt';
const app = express();
// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Prueba de lectura de archivo
app.get('/read-file', (req, res) => {
    const data = readFile(FILE_NAME);
    res.send(data);
});

// API
// Listar Motos
app.get('/motorcycle', (req, res) => {
    const data = readFile(FILE_NAME);
    res.json(data);
})
// Crear moto
app.post('/motorcycle', (req, res) => {
    const { error } = createMotoSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    //Leer el archivo de Motos
    const data = readFile(FILE_NAME);
    //Agregar la nueva moto (Agregar ID)
    const newMot = req.body;
    console.log(req.body);
    newMot.id = uuidv4();
    console.log(newMot)
    data.push(newMot);
    // Escribir en el archivo
    writeFile(FILE_NAME, data);
    res.json({ message: 'La moto fue creada con éxito' })
    // El cuerpo de la solicitud es válido, puedes continuar con el código para crear la moto
});

// Actualizar moto
app.put('/motorcycle/:id', (req, res) => {
    const { error } = updateMotoSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    console.log(req.params.id);
    const id = req.params.id;
    const motorcycle = readFile(FILE_NAME);
    const motIndex = motorcycle.findIndex(mot => mot.id === id);
    if (motIndex < 0) {
        return res.status(404).json({ ok: false, message: "Motorcycle not found" });
    }
    let mot = motorcycle[motIndex];
    mot = { ...mot, ...req.body };
    motorcycle[motIndex] = mot;
    writeFile(FILE_NAME, motorcycle);
    res.json({ Melo: true, motorcycle: mot, message: "Motorcycle update successfully" });
});

// Obtener moto
app.get('/motorcycle/:id', (req, res) => {
    console.log(req.params.id);
    //Guardar el ID
    const id = req.params.id
    //Leer el contenido del archivo
    const motorcycle = readFile(FILE_NAME)
    // Buscar la moto con el ID que recibimos
    const motFound = motorcycle.find(mot => mot.id === id)
    const { error } = getMotoSchema.validate(req.params);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    else if (!motFound) {
        res.status(404).json({ 'ok': false, message: "Motorcycle not found" });

    }
    res.json({ 'Moto': true, motorcycle: motFound });
});

//Eliminar una moto
app.delete('/motorcycle/:id', (req, res) => {
    const { error } = getMotoSchema.validate(req.params);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const id = req.params.id;
    const motorcycle = readFile(FILE_NAME);
    const motIndex = motorcycle.findIndex(mot => mot.id === id);
    if (motIndex < 0) {
      return res.status(404).json({ 'ok': false, message: "Motorcycle not found" });
    }
    motorcycle.splice(motIndex, 1);
    writeFile(FILE_NAME, motorcycle);
  
    res.json({ 'Melo': true, message: "Motorcycle delete successfully" });
  });

app.listen(3000, () => {
    console.log(`Server is running on http://localhost:3000`)
});
