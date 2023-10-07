import { cartsModel } from '../models/carts.model.js';
import { productsModel } from '../models/products.model.js';
import ProductManager from './ProductManager.js';

const productManager = new ProductManager()

class CartManager {

  async addCart() {
    let cart2 = {}
    try {
      cart2 = { products: [] }
      const carnnew = await cartsModel.create(cart2)
      return `SUC|Carrito agregado con el id ${carnnew._id}`

    } catch (error) {
      return `ERR|Error generico. Descripcion :${error}`
    }
  }

  async addCartProducts(pid, cid) {

    try {
      const cartObject = await cartsModel.findById({ _id: cid })
      if (cartObject == undefined || cartObject.length === 0) return `E02|El carro con el id ${cid} no se encuentra agregado.`;

      const productObject = await productsModel.find({ _id: pid })

      if (productObject == undefined || productObject.length === 0) return `E02|El producto con el id ${pid} no se encuentra agregado.`;

      if (cartObject.products.find(prod => prod.id == pid)) {
        let ProductinsideCart = cartObject.products.find(prod => prod.id == pid)

        ProductinsideCart.quantity += 1

        cartObject.save();

        return `SUC|Producto sumado al carrito con el producto ya existente`
      }
      cartObject.products.push({ id: pid, quantity: 1 });

      await cartObject.save();

      return `SUC|Producto agregado al carrito ${cid}`

    } catch (error) {
      return `ERR|Error generico. Descripcion :${error}`
    }
  }

  async getCarts() {
    try {
      const allCarts = await cartsModel.find();
      return allCarts

    } catch (error) {
      return `ERR|Error generico. Descripcion :${error}`
    }
  }

  async getCartById(cid) {
    try {

      const CartById = await cartsModel.find({ _id: cid }).lean()

      if (CartById == undefined) return `E02|El carro con el id ${cid} no se encuentra agregado.`;

      return CartById

    } catch (error) {
      return `ERR|Error generico. Descripcion :${error}`
    }
  }

  async getProductsinCartById(cid) {
    try {
      const cartObject = await cartsModel.find({ _id: cid }).lean()
      if (cartObject == undefined) return `E02|El carro con el id ${cid} no se encuentra agregado.`;

      const products = cartObject[0].products;

      return products

    } catch (error) {
      return `ERR|Error generico. Descripcion :${error}`
    }
  }

  async deleteCart(cid) {
    try {

      await cartsModel.deleteOne({ _id: cid })

      return `SUC|El carrito con el id ${cid} fue eliminado.`
    }
    catch (error) {
      return `ERR|Error generico. Descripcion :${error}`
    }
  }

  async deleteCartProduct(pid, cid) {
    const CartById = await cartsModel.findById({ _id: cid })
    let ProductinsideCart = CartById.products.find(prod => prod.id == pid)

    if (ProductinsideCart) {
      await CartById.products.pull(ProductinsideCart);
      await CartById.save();
      return `SUC|Producto eliminado del carrito`
    } else {
      return `E02|El producto con el id ${pid} no se encuentra agregado.`;
    }
  }

  async deleteAllCartProducts(cid) {

    const CartById = await cartsModel.findById({ _id: cid })
    if (CartById == undefined || CartById.length === 0) return `E02|El carro con el id ${cid} no se encuentra agregado.`;

    const response = await cartsModel.updateOne(
      { "_id": cid },
      { $set: { products: [] } }
    )
    return `SUC|Productos eliminados del carrito ${cid}`

  }

  async updateCartProductQuantity(pid, cid, quantity_) {
    let { quantity } = quantity_;

    const cartObject = await cartsModel.findById({ _id: cid })
    if (cartObject == undefined || cartObject.length === 0) return `E02|El carro con el id ${cid} no se encuentra agregado.`;

    const productObject = await productsModel.find({ _id: pid })
    if (productObject == undefined || productObject.length === 0) return `E02|El producto con el id ${pid} no se encuentra agregado.`;

    let updateObject = await cartsModel.updateOne({
      "_id": cid,
      "products.id": pid
    }, {
      $set: {
        "products.$.quantity": quantity
      }
    })
    if (updateObject.modifiedCount > 0) {
      return `SUC|Producto actualizado del carrito`
    } else {
      return `E02|No se pudo actualizar el productocon el id ${pid}`;
    }
  }

  async updateCartProducts(cid, products) {
    const swFailedBool = false;
    console.log("entro en el updateCartProducts")

    const cartObject = await cartsModel.findById({ _id: cid })
    if (cartObject == undefined || cartObject.length === 0) return `E02|El carro con el id ${cid} no se encuentra agregado.`;

    console.log("VAMOS A STINGIFY PRIOMERO")
    const convertToString = JSON.stringify(products);

    console.log("VAMOS A CONVERTIR EN OBJETO")
    const convertToJSON = JSON.parse(convertToString);

    console.log("VAMOS A CONVERTIR EN STRING")
    const productStringify = JSON.stringify(convertToJSON.products)
    console.log(productStringify)

    console.log("VAMOS A CONVERTIR EN OBJETO")
    const convertToJSONagain = JSON.parse(productStringify);
    console.log(convertToJSONagain)
    // console.log(typeof (convertToJSONagain))
    const listaa =  []
    // // Iterate over each object in the array
    convertToJSONagain.forEach(async (product) => {

      listaa.push(product.id)

      // console.log("entro en el foreach")
      // console.log("llamara a getproductbyid dentro el foreach")
      // console.log(product) // funcionA
      // console.log(product.id) // funcionA
      // const productModel = await productManager.getProductById(product.id);
      // console.log("YA LLAMO a getproductbyid dentro el foreach")
      // console.log(productModel)
    });
    listaa.forEach( async (product) => {
      // Do something with the product
      console.log("llamara a getproductbyid dentro el foreach")

      const productModel = await productManager.getProductById(product.id);
      console.log("YA LLAMO a getproductbyid dentro el foreach")

    });
    // for (const product in convertToJSONagain) {
    //   // console.log( typeof(product) )
    //   // console.log(product)
    //   console.log("entro en el for")
    //   console.log(product)
    //   console.log(product.id)
    //   // console.log(JSON.parse(product))
    //   const productModel = await productManager.getProductById(product.id);
    //   console.log("llamo al getproducbyidc en el for")
    //   console.log(typeof(productModel))
    //   // console.log(productModel)

    //   // const aaa= JSON.stringify(productModel)
    //   // console.log(aaa)

    //   if (!productModel && productModel == undefined && productModel == []) {
    //     return `E02|El producto con el id ${product.id} no se encuentra agregado. No se actualizo el Carrito`;
    //   }
    // }


    //  await convertToJSONagain.forEach( async (product) => {

    //   console.log("entro en el foreach")
    //   // console.log(product)
    //   // console.log(typeof (product))
    //   console.log("llamar a getproductbyid")

    //   const productModel = await productManager.getProductById(product.id);

    //   console.log("ya no llama  a getproductbyid")


    //   console.log(typeof (productModel))
    //   console.log(productModel)

    //   // const sw = typeof(productModel) === 'string'? true : false;
    //   // console.log(sw)
    //   if (typeof (productModel) === 'string' || !productModel) {
    //     console.log("entro en el fallido")
    //     swFailedBool = true;
    //   }

    //   swFailedBool = false;

    // });

    console.log("salio del foreach")
    console.log(swFailedBool)
    if (swFailedBool) return `E02| No se pudo encontrar uno o mas productos indicados, no se actualizo el carrito.`;

    console.log("paso el foreach quiere decir que todos los productos estan en bs")

    // const productObject = await productsModel.find({ _id: pid })
    // if (productObject == undefined || productObject.length === 0) return `E02|El producto con el id ${pid} no se encuentra agregado.`;

    // let updateObject = await cartsModel.updateOne({
    //   "_id": cid,
    //   "products.id": pid
    // }, {
    //   $set: {
    //     "products.$.quantity": quantity
    //   }
    // })
    // if (updateObject.modifiedCount > 0) {
    //   return `SUC|Producto actualizado del carrito`
    // } else {
    //   return `E02|No se pudo actualizar el productocon el id ${pid}`;
    // }

    // Eliminar todos los productos del carrito actual
    carrito.productos = [];
    console.log("empezara a hacer un push de todos los productos en un nuevo  carro")

    // Agregar los nuevos productos
    products.forEach((producto) => {
      carrito.productos.push(producto);
    });
    console.log("ya empujo todos los nuevos productos al carro")
    console.log(carrito)


    // Actualizar el carrito en la base de datos
    carrito.save();
    console.log("ya salvo")


  }

}

export default CartManager;



