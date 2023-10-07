import express from "express"
import handlebars from "express-handlebars"
import { Server } from 'socket.io'
import __dirname from './utils.js'
import ProductRoutes from './router/productMongo.routes.js'
import CartManager from './dao/db/CartManager.js'
import ChatsRoutes from './router/chat.routes.js'
import CartRoutes from './router/cartMongo.routes.js'
import ProductManager from './dao/db/ProductManager.js'
import ViewsRouter from './router/views.routes.js'
import UserRouter from './router/user.router.js'
// import { FileStore } from "session-file-store"
import MongoStore from "connect-mongo"
import session from "express-session"
import mongoose from "mongoose"
import { uploader } from './dao/middlewares/multer.js'
import socketEvents from "./socket/index.js"
import cookieParser from "cookie-parser"
import { userModel } from "./dao/models/user.model.js"

const productManager = new ProductManager();
const cartManager = new CartManager();
const port = 8080
const app = express()
// const fileStore = FileStore(session)

//Creacion del servidorHTTP
const HTTPserver = app.listen(port, () =>
  console.log(`Port listening on port ${HTTPserver.address().port}`)
);

async function connectToMongoose() {
  try {
    //Conetando con Atlas
    await mongoose.connect('mongodb+srv://albertsleyther:09NbqGe9gecOLTBy@ecommerce.6lrddnh.mongodb.net/?retryWrites=true&w=majority');
  } catch (error) {
    console.error(`Failed to connect to Mongoose: ${error}`);
  }
}

connectToMongoose().then(() => {
  console.log(`Connected to Mongoose`)
});


//Creacion del servidor con Socketio
const Socketserverio = new Server(HTTPserver)

// Mi socketSServer a la escucha
Socketserverio.on('connection', async (socket) => {

  console.log(`client connected with id ${socket.id}`)

  const productList = await productManager.getProducts(10, 1, null, null);

  await Socketserverio.emit('AllProducts', productList)

  await Socketserverio.emit('AllProductsCart', productList)

  socket.on('sendNewProduct', async (newP) => {

    const newProduct = {
      description: newP.description,
      title: newP.title,
      price: parseInt(newP.price, 10),
      thumbnail: newP.thumbnail,
      code: newP.code,
      stock: parseInt(newP.stock, 10),
      status: newP.status,
      category: newP.category,

    }
    await productManager.addProduct(newProduct);
    const productList = await productManager.getProducts(10, 1, null, null);
    Socketserverio.emit('AllProducts', productList)
  })

  socket.on('functionDeleteProduct', async (idp) => {
    await productManager.deleteProduct(idp);
    const productList = await productManager.getProducts();
    Socketserverio.emit('AllProducts', productList)
  })
  socket.on('message', async (data) => {
    await messagesModel.create(data)
    const messag = await messagesModel.find().lean()
    Socketserverio.emit('newMessage', messag)
  })
  socket.on('obtainCartInfo', async (cid) => {
    const cart = await cartManager.getCartById(cid)
    // const messag = await messagesModel.find().lean()
    Socketserverio.emit('cartInforSend', cart)
  })
  socket.on('addNewProducttoCart', async ({ pid, cid }) => {
    const newproductincart = await cartManager.addCartProducts(pid, cid)
    Socketserverio.emit('newProductinCart', newproductincart)
  })
})

HTTPserver.on("error", (error) => console.log`Server error ${error}`)

//Seccion de handlebars
app.engine("handlebars", handlebars.engine())
app.set("views", __dirname + "/views")
app.set("view engine", "handlebars")

//Seccion de Static
app.use(express.static(__dirname + "/public"))

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())

app.use(session({
  // store: new fileStore({ path: "/sessions", ttl: 100, retries: 0 }),
  store: MongoStore.create({
    mongoUrl: 'mongodb+srv://albertsleyther:09NbqGe9gecOLTBy@ecommerce.6lrddnh.mongodb.net/?retryWrites=true&w=majority',
    ttl: 20   ,
  }),
  secret: 'secretCoder',
  resave: true,
  saveUninitialized: true

}))

app.use('/api' , UserRouter)
app.use('/api/products', ProductRoutes)
app.use('/api/carts', CartRoutes)
app.use('/api/chats', ChatsRoutes)
app.use('/', ViewsRouter)


// app.get('/login', (req, res) => {
//   if (req.session.isLogged) {
//     return res.send('ya estas logheado');
//   }
//   req.session.isLogged = true
//   res.send("acabas de logear")

// })

// app.get('/cookies', (req, res) => {
//   res.render("cookies", {
//     title: "cookies",
//     style: "cookies.css"
//   })
// })

// app.get('/getCookies', (req, res) => {
//   res.send(req.cookies)
// })

// app.post('/setCookies', (req, res) => {
//   const { nombre, valor } = req.body;
//   res.cookie(nombre, valor, { maxAge: 1000 * 10 }).send('Cookie creada');
// });

// app.get('/root', (req, res) => {
//   if (req.session?.nombre) {
//     console.log("entro en session activa")
//     const counter = req.session.counter;
//     req.session.counter = req.session.counter + 1;
//     res.send(`Hola ${req.session.nombre}, visitaste el sitio ${counter} veces`);
//   } else {
//     console.log("entro  primera sessiona")

//     const nombre = req.query.nombre;
//     req.session.nombre = nombre;
//     req.session.counter = 1;
//     res.send(`Te damos la bienvenida`);
//   }
// });

 //socketEvents(Socketserverio)

