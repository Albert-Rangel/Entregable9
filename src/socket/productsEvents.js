
import ProductManager from '../dao/db/ProductManager.js'
const productManager = new ProductManager();


const productsEvents = (socketServer) => {

    socketServer.on('connection', async (socket) => {

        console.log(`client connected with id ${socket.id}`)

        const productList = await productManager.getProducts();

        socketServer.emit('AllProducts', productList)
       
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
            const productList = await productManager.getProducts();
            socketServer.emit('AllProducts', productList)
        })

        socket.on('functionDeleteProduct', async (idp) => {
            await productManager.deleteProduct(idp);
            const productList = await productManager.getProducts();
            socketServer.emit('AllProducts', productList)
        })
    })
};
export default productsEvents
