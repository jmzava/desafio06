const express = require('express')
const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')


const app = express()
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)
const Productos = require('./api/producto')
const storProd = new Productos()
const myRoutes =require('./api/routes')

app.use(express.static('public'))
app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.set('view engine', 'ejs');
app.set('views','./public/views');

const PORT = 8080 
 
// ---------------- Prod ---------------------------------

// --------------- Mensaje-------------------------------

const messages = []

// ----------------socket-----------------------------------

io.on('connection', (socket) => {
    console.log('¡Nuevo cliente conectado!')
//----------------------- socket mensajes 
    socket.emit('messages', messages)
    
    socket.on('new-message',data => {
        messages.push(data);
        io.sockets.emit('messages', messages);
    });


    //----------------------- socket productos

    socket.emit('products', storProd.productsAll)

    socket.on('newProd', dataProd =>{
        storProd.saveProduct(dataProd)
        io.sockets.emit('products', storProd.productsAll);
    })

    })

 

//--------------- Rutas ------------------

app.use('/', myRoutes)

httpServer.listen(PORT, () => console.log('Servidor corriendo en http://localhost:8080'))

