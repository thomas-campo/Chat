import express from 'express';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';

import viewsRouter from './routes/views.router.js';
import __dirname from './utils.js';

const app = express();
const PORT = process.env.PORT||8080;
const server = app.listen(PORT,()=>console.log(`Listening on 8080`));

app.engine('handlebars',handlebars.engine());
app.set('views',`${__dirname}/views`);
app.set('view engine','handlebars');

app.use(express.static(`${__dirname}/public`))
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/',viewsRouter);

const io = new Server(server);

const messages = [];
io.on('connection',socket=>{
    console.log("Nuevo socket conectado");
    socket.emit('logs',messages);//al loguearte te muestra los mensajes
    socket.on('message',data=>{
        console.log(data);
        messages.push(data);
        io.emit('logs',messages);//envia constantemente los mensages a los que estan logueados
    })
    socket.on('authenticated',data=>{
        socket.broadcast.emit('newUserConnected',data);//con el broadcast le manda a todos menos al usuario/socket/cliente q esta logueando
    })
})