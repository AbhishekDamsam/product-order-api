import { Schema, Document, model } from 'mongoose';

interface Product {
  productId: number,
  price: number,
  quantity: number
}

export interface IOrder {
  totalPrice: number
  products: Product[]
}

export interface IOrderModel extends Document, IOrder { }

const schema = new Schema(
  {
    totalPrice: {
      type: Number,
      required: true

    },
    products: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
)
schema.index({ title: 'text', description: 'text' });

export const Order = model<IOrderModel>('Order', schema)
