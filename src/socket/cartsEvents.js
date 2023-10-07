
import CartManager from '../dao/db/CartManager.js'
import ProductManager from '../dao/db/ProductManager.js'

const cartManager = new CartManager();
const productManager = new ProductManager();



const cartsEvents = (socketServer) => {

    socketServer.on('connection', async (socket) => {

        console.log(`client connected with id ${socket.id}`)

        const productList = await productManager.getProducts();
        // console.log(productList)
        socketServer.emit('AllProductsCart', productList)

        socket.on('obtainCartInfo', async (cid) => {
            const cart = await cartManager.getCartById(cid)
            // const messag = await messagesModel.find().lean()
            socketServer.emit('cartInforSend', cart)
        })
        socket.on('addNewProducttoCart', async ({ pid, cid }) => {
            const newproductincart = await cartManager.addCartProducts(pid, cid)
            socketServer.emit('newProductinCart', newproductincart)
        })
    })
};
export default cartsEvents
