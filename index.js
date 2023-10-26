// Librerías externas
// Librerías externas
require('dotenv').config()
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

//Usar el motor de plantillas de EJS
app.set('views', './src/views');
app.set('view engine', 'ejs');

// Prueba de lectura de archivo
app.get('/read-file', (req, res) => {
    const data = readFile(FILE_NAME);
    res.send(data);
});

// API
// Listar Motos
app.get('/motorcycle', (req, res) => {
    const data = readFile(FILE_NAME);
    res.render('motorcycle/index', { motorcycles: data });
})
//Crear Moto
app.get('/motorcycle/create', (req, res)=>{
    //Mostrar el formulario
    res.render('motorcycle/create');
});
// Crear moto
app.post('/motorcycle', (req, res) => {
    try {
        //Leer el archivo de moto
        const data = readFile(FILE_NAME);
        //Agregar la nueva moto (Agregar ID)
        const newMot = req.body;
        newMot.id = uuidv4();
        console.log(newMot)
        data.push(newMot);
        // Escribir en el archivo
        writeFile(FILE_NAME, data);
        res.redirect('/motorcycle');
    } catch (error) {
        console.error(error);
        res.json({ message: 'Error al almacenar la motocicleta' });
    }
});
//Crear Moto
app.get('/motorcycle/edit/:id', (req, res)=>{
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
    res.render('motorcycle/update',{
        motorcycle: motFound
    })
});
// Actualizar moto
app.put('/motorcycle/', (req, res) => {
    // const { error } = updateMotoSchema.validate(req.body);
    // if (error) {
    //     return res.status(400).json({ message: error.details[0].message });
    // }
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
app.post('/motorcycle/delete/:id', (req, res) => {
    console.log(req.params.id);
    //Guardar el ID
    const id = req.params.id
    //Leer el contenido del archivo
    const motorcycles = readFile(FILE_NAME)
    // Buscar la moto con el ID que recibimos
    const motorcycleIndex = motorcycles.findIndex(motorcycle => motorcycle.id === id )
    if( motorcycleIndex < 0 ){// Si no se encuentra la moto con ese ID
        res.status(404).json({'ok': false, message:"Motorcycle not found"});
        return;
    }
    //Eliminar la moto que esté en la posición MotorcycleIndex
    motorcycles.splice(motorcycleIndex, 1);
    writeFile(FILE_NAME, motorcycles)
    res.redirect('/motorcycle');
})

app.listen(3001, () => {
    console.log(`Server is running on http://localhost:3001`)
});
