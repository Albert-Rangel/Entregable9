import { productsModel } from '../models/products.model.js';

class ProductManager {

  async addProduct(ObjectProduct) {

    try {

      const { title, description, price, thumbnail, code, stock, status, category } = ObjectProduct;

      const product = await productsModel.create({
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        status,
        category
      });
      return `SUC|Producto agregado con el id ${product._id}`

    } catch (error) {
      return `ERR|Error generico. Descripcion :${error}`
    }
  }
  async getProducts_() {
    try {
      const products = await productsModel.find().lean();
      return products;

    } catch (error) {
      return `ERR|Error generico. Descripcion :${error}`
    }
  }
  async getProducts(limit, page, sort_, query) {
    try {
      let key = "";
      let value = "";
      let products;

      if (query != undefined) {
        const queryObject = query.split(":")
        key = queryObject[0];
        value = queryObject[1];
      }

      products = await productsModel.paginate(
        query == undefined ? undefined : generateKeyValue(key, value)
        ,
        {
          page: page,
          limit: limit,
          sort: sort_ == undefined ? undefined : { price: sort_ },
          lean: true
        });

      function generateKeyValue(key, value) {
        return {
          [key]: value
        };
      }

      const keyValue = generateKeyValue(key, value);

      // products.prevLink = result.hasPrevPage
      //   ? `http://localhost:8080/products?page=${products.prevPage}`
      //   : '';
      // products.nextLink = result.hasNextPage
      //   ? `http://localhost:8080/products?page=${products.nextPage}`
      //   : '';
      // products.isValid = !(page <= 0 || page > products.totalPages);

      // return res.render('students', result);

      // const products = await productsModel.find().lean();
      // return products.sort((a, b) => a.id - b.id).slice(0, limit==null?10: limit);
      // console.log(products)
      return products

    } catch (error) {
      return `ERR|Error generico. Descripcion :${error}`
    }
  }

  async getProductById(pid) {
    try {
      // console.log("entro em el getproductbiyis")
      const found = await productsModel.find({ _id: pid });
      // console.log(found)

      if (found == undefined) return `E02|El producto con el id ${pid} no se encuentra agregado.`;
      return found;

    } catch (error) {
      return `ERR|Error generico. Descripcion :${error}`
    }
  }

  async updateProduct(pid, product) {
    try {

      const { title, description, price, thumbnail, code, stock, status, category } = product;

      const found = await productsModel.find({ _id: pid });
      if (found == undefined) return `E02|El producto con el id ${pid} no se encuentra agregado.`;

      for (const [key, value] of Object.entries(product)) {
        found[key] = value;
      }

      await productsModel.updateOne(
        { _id: pid },
        {
          title,
          description,
          price,
          thumbnail,
          code,
          stock,
          status,
          category
        });

      return `SUC|El producto con el id : ${pid} fue actualizado.`;

    } catch (error) {
      return `ERR|Error generico. Descripcion :${error}`
    }
  }

  async deleteProduct(pid) {
    try {

      await productsModel.deleteOne({ _id: pid });

      return `SUC|El producto con el id ${pid} fue eliminado.`
    }
    catch (error) {
      return `ERR|Error generico. Descripcion :${error}`
    }
  }
}

export default ProductManager;
