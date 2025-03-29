const express=require("express");
const cors = require('cors');
const morgan=require("morgan");
const http = require('http');
const WebSocket = require('ws');
const {SerialPort}  = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

const port = new SerialPort({
  path: 'COM4',  
  baudRate: 9600,
  dataBits: 8,
  stopBits: 1,
  parity: 'none',
  autoOpen: false, 
});

const parser = port.pipe(new ReadlineParser({ delimiter: '\r' }));

port.open((err) => {
  if (err) {
    console.error('Error abriendo el puerto:', err);
  } else {
    console.log('Puerto abierto');
    setInterval(() => {
      port.write('P'); 
      port.drain();
    }, 1000);
  }
});

parser.on('data', (data) => {
  // console.log(wss.clients)
  console.log(  wss.clients.size);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      console.log('Enviando mensaje:', data);
      client.send(data.trim());
    }
  });
});

port.on('error', (err) => {
  console.error('Error en la comunicación del puerto:', err);
});

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
    console.log('Mensaje recibido:', message);
    ws.send(`Echo: ${message}`); // Enviar respuesta al cliente
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