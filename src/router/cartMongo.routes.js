import Router from "express"
import CartManager from '../dao/db/CartManager.js'
const cartManager = new CartManager('./src/models/carts.json');
const CartRoute = Router();

//Obtiene un carro por su id
CartRoute.get('/byId/:cid', async function (req, res) {
    const cid = req.params.cid
    const cartObject = await cartManager.getCartById(cid);
    console.log(cartObject)
    const isString = (value) => typeof value === 'string';
    if (isString(cartObject)) {
        const arrayAnswer = ManageAnswer(cartObject)
        return res.status(arrayAnswer[0]).send({
            status: arrayAnswer[0],
            message: arrayAnswer[1]
        })
    }
    return res.send(cartObject);
});

//obtiene todos los carros
CartRoute.get('/', async function (req, res) {
    const limit = req.query.limit;
    const cartObject = await cartManager.getCarts();
    const isString = (value) => typeof value === 'string';
    if (isString(cartObject)) {
        const arrayAnswer = ManageAnswer(cartObject)
        return res.status(arrayAnswer[0]).send({
            status: arrayAnswer[0],
            message: arrayAnswer[1]
        })
    }
    if (limit) {

        return res.send(cartObject.slice(0, limit));
    }
    return res.send(cartObject.sort((a, b) => a.id - b.id));
});

//crea un carro sin productos
CartRoute.post('/', async function (req, res) {
    const answer = await cartManager.addCart()
    const arrayAnswer = ManageAnswer(answer)
    return res.status(arrayAnswer[0]).send({
        status: arrayAnswer[0],
        message: arrayAnswer[1]
    })
})

//Agrega un producto  especifico a un carro especifico
CartRoute.post('/:cid/product/:pid', async function (req, res) {
    const cid = req.params.cid
    const id = req.params.pid
    const answer = await cartManager.addCartProducts(id, cid)
    const arrayAnswer = ManageAnswer(answer)
    return res.status(arrayAnswer[0]).send({
        status: arrayAnswer[0],
        message: arrayAnswer[1]
    })
})

//Elimina un producto especifico de un carro especifico
CartRoute.delete('/:cid/product/:pid', async function (req, res) {
    const cid = req.params.cid
    const id = req.params.pid
    const answer = await cartManager.deleteCartProduct(id, cid)
    const arrayAnswer = ManageAnswer(answer)
    return res.status(arrayAnswer[0]).send({
        status: arrayAnswer[0],
        message: arrayAnswer[1]
    })
})

//Elimina un carro en especifico
CartRoute.delete('/SpecificCart/:cid', async function (req, res) {
    const cid = req.params.cid
    const answer = await cartManager.deleteCart(cid)
    const arrayAnswer = ManageAnswer(answer)
    return res.status(arrayAnswer[0]).send({
        status: arrayAnswer[0],
        message: arrayAnswer[1]
    })
})

//Elimina todos los productos dentro de un carro especifico
CartRoute.delete('/:cid', async function (req, res) {
    const cid = req.params.cid
    const answer = await cartManager.deleteAllCartProducts(cid)
    const arrayAnswer = ManageAnswer(answer)
    return res.status(arrayAnswer[0]).send({
        status: arrayAnswer[0],
        message: arrayAnswer[1]
    })
})

//Actualiza el Quantity Dde un producto especifico en un carro especifico
CartRoute.put('/:cid/product/:pid', async function (req, res) {
    const cid = req.params.cid
    const id = req.params.pid
    let quantity_ = req.body
    const answer = await cartManager.updateCartProductQuantity(id, cid, quantity_)
    const arrayAnswer = ManageAnswer(answer)
    return res.status(arrayAnswer[0]).send({
        status: arrayAnswer[0],
        message: arrayAnswer[1]
    })

})

//Actualiza los productos en un carro especifico
CartRoute.put('/:cid', async function (req, res) {
    console.log("entro en router")
    const cid = req.params.cid
    // const id = req.params.pid
    let products = req.body
    const answer = await cartManager.updateCartProducts( cid, products)
    const arrayAnswer = ManageAnswer(answer)
    return res.status(arrayAnswer[0]).send({
        status: arrayAnswer[0],
        message: arrayAnswer[1]
    })

})

function ManageAnswer(answer) {
    const arrayAnswer = []
    if (answer) {
        const splitString = answer.split("|");
        switch (splitString[0]) {
            case "E01":
                arrayAnswer.push(400)
                arrayAnswer.push(splitString[1])
                return arrayAnswer
                break;
            case "E02":
                arrayAnswer.push(404)
                arrayAnswer.push(splitString[1])
                return arrayAnswer
                break;
            case "SUC":
                arrayAnswer.push(200)
                arrayAnswer.push(splitString[1])
                return arrayAnswer
                break;
            case "ERR":
            default:
                arrayAnswer.push(500)
                arrayAnswer.push(splitString[1])
                return arrayAnswer
                break;
        }
    }
}

export default CartRoute;