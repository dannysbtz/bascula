const express=require("express");
const cors = require('cors');
const morgan=require("morgan");
const http = require('http');
const WebSocket = require('ws');
const {SerialPort}  = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

let com ='COM3'
let port;
let parser;
let inter;

function openPort(comName) {
  if (port && port.isOpen) {
    port.close((err) => {
      if (err) {
        console.error('Error cerrando el puerto:', err);
      } else {
        console.log('Puerto anterior cerrado');
        clearInterval(inter);
        inter = null;
        startPort(comName); // volver a abrir con el nuevo
      }
    });
  } else {
    startPort(comName); // abrir directamente si no hay puerto abierto
  }
}

function startPort(comName) {
  port = new SerialPort({
    path: comName,
    baudRate: 9600,
    dataBits: 8,
    stopBits: 1,
    parity: 'none',
    autoOpen: false,
  });

  parser = port.pipe(new ReadlineParser({ delimiter: '\r' }));

  port.open((err) => {
    if (err) {
      console.error('Error abriendo el puerto:', err);
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: 'error',
            value: 'Báscula no detectada'
          }));
        }
      });
    } else {
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: 'conectada',
            value: 'Báscula conectada'
          }));
        }
      });
      console.log('Puerto abierto:', comName);
      inter = setInterval(() => {
        port.write('P');
        port.drain();
      }, 1000);
    }
  });

  parser.on('data', (data) => {
    console.log('Datos recibidos:', data);
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          type: 'peso',
          value: parseFloat(data.trim())
        }));
      }
    });
  });

  port.on('error', (err) => {
    console.error('Error en el puerto:', err);
  });
}

openPort(com);


const app=express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(cors({
  origin: function (origin, callback) {
    callback(null, true);
  },
  credentials: true
}));

wss.on('connection', (ws) => {
  console.log('Cliente WebSocket conectado');

  ws.on('message', (message) => {
    const texto = message.toString();
    openPort(texto);
    console.log('Mensaje recibido:', texto);
  });

  ws.on('close', () => {
    console.log('Cliente desconectado');
  });
});


app.use(morgan('dev'));
require('./database');
require('dotenv').config();

//#endregion

//#region  Settings

app.set('port',process.env.PORT||3335);
//#region Server is Listenning 
server.listen(app.get('port'),()=>{
    console.log('Server on port ',app.get('port'));
});
//#endregion