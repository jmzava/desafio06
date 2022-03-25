const express = require('express')
const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')

const app = express()
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)
const Productos = require('./api/producto')
const HistoryChat = require('./api/historychat')

const storProd = new Productos()
const history = new HistoryChat()

const myRoutes =require('./api/routes')

app.use(express.static('public'))
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(myRoutes)


app.set('view engine', 'ejs');
app.set('views','./public/views');


// ----------------socket-----------------------------------

io.on('connection', async (socket) => {
    console.log('¡Nuevo cliente conectado!')

    //----------------------- socket mensajes 
    const message = await history.loadMessage()
    socket.emit('messages', message )
    
    socket.on('new-message',async data => {
        await history.saveMessage(data)
        const message2 = await history.loadMessage()
        io.sockets.emit('messages', message2 );
    });

//----------------------- socket productos

    socket.emit('products', storProd.productsAll)

    socket.on('newProd', dataProd =>{
        storProd.saveProduct(dataProd)
        io.sockets.emit('products', storProd.productsAll);
    })

    })

 

//--------------- Server ------------------

const PORT = 8080 
httpServer.listen(PORT, () => console.log('Servidor corriendo en http://localhost:8080'))

