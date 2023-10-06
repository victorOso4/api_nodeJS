// Librerías externas
// Librerías externas
const express = require('express');
// const app = require('express').Router();
const {validatorHandler} = require('./middlewares/validator.handler');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

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
app.get('/motorcycle', (req, res)=>{
    const data = readFile(FILE_NAME);
    res.json(data);
})

//Crear moto
app.post('/motorcycle', (req, res) => {
    try {
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
        res.json({ message: 'La moto fue creada con éxito' });
    } catch (error) {
        console.error(error);
        res.json({ message: 'Error al almacenar la moto' });
    }
});

//Obtener una sola moto
app.get('/motorcycle/:id', (req, res) => {
    console.log(req.params.id);
    //Guardar el ID
    const id = req.params.id
    //Leer el contenido del archivo
    const motorcycle = readFile(FILE_NAME)
    // Buscar la moto con el ID que recibimos
    const motFound = motorcycle.find(mot => mot.id === id )
    if(!motFound){// Si no se encuentra la moto con ese ID
        res.status(404).json({'ok': false, message:"motorcycle not found"})
        return;
    }
    res.json({'Moto': true, motorcycle: motFound});
})

//Actualizar una moto
app.put('/motorcycle/:id', (req, res) => {
    console.log(req.params.id);
    //Guardar el ID
    const id = req.params.id
    //Leer el contenido del archivo
    const motorcycle = readFile(FILE_NAME)
    // Buscar la moto con el ID que recibimos
    const motIndex = motorcycle.findIndex(mot => mot.id === id )
    if( motIndex < 0 ){// Si no se encuentra la moto con ese ID
        res.status(404).json({'ok': false, message:"Motorcycle not found"});
        return;
    }
    let mot = motorcycle[motIndex]; //Sacar del arreglo
    mot = { ...mot, ...req.body  };
    motorcycle[motIndex] = mot; //Poner la moto en el mismo lugar
    writeFile(FILE_NAME, motorcycle);
    //Si la moto existe, modificar sus datos y almacenarlo nuevamente
    res.json({'Melo': true, motorcycle: mot, message:"Motorcycle update successfully"});
})

//Eliminar una moto
app.delete('/motorcycle/:id', (req, res) => {
    console.log(req.params.id);
    //Guardar el ID
    const id = req.params.id
    //Leer el contenido del archivo
    const motorcycle = readFile(FILE_NAME)
    // Buscar la moto con el ID que recibimos
    const motIndex = motorcycle.findIndex(mot => mot.id === id )
    if( motIndex < 0 ){// Si no se encuentra la moto con ese ID
        res.status(404).json({'ok': false, message:"Motorcycle not found"});
        return;
    }
    //Eliminar la moto que esté en la posición motIndex
    motorcycle.splice(motIndex, 1);
    writeFile(FILE_NAME, motorcycle)
    res.json({'Melo': true, message:"Motorcycle delete successfully"});
})

app.listen(3000, () => {
    console.log(`Server is running on http://localhost:3000`)
});
