import { Schema, Document, model } from 'mongoose'

export interface IProduct {
  productId: number //This is not needed. Since _id keeps on changing on every product collection initial setup, productId can be used in checkout.
  title: string
  description: string
  picture: string
  price: number
}

export default interface IProductModel extends Document, IProduct {}

const schema = new Schema(
  {
    productId: {
      type: Number,
      required: true

    },
    title: {
      type: String,
      required: true,
      minlength: 3,
    },
    description: {
      type: String,
      required: true,
      maxlength: 500,
    },
    picture: {
      type: String,
      required: true,
    },
    price: {
        type: Number,
        required: true,
        min: 1
    },
  },
  {
    //timestamps: true,
    versionKey: false,
  },
)
schema.index({ title: 'text', description: 'text' });

export const Product = model<IProductModel>('Product', schema)
