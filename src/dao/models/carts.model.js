import mongoose, { mongo } from "mongoose";

const cartsCollection = 'carts';

const cartsSchema = new mongoose.Schema({
    // products: [
    //     {
    //         pid: {
    //             type: String,
    //             required: true,
    //         },
    //         quantity: {
    //             type: Number,
    //             required: true,
    //         }
    //     }
    // ],
    products: {
        type: [
            {
                id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "products"
                },
                quantity: {
                    type: Number,
                    required: true,
                }
            }
        ], default: []
    },
})

cartsSchema.pre("find", function () {
    this.populate("products.id")
})


const cartsModel = mongoose.model(cartsCollection, cartsSchema)

export { cartsModel }