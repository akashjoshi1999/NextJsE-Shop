import { Schema, models, model, type Document } from "mongoose"

interface IProduct extends Document {
  name: string
  slug: string
  description: string
  price: number
  stock: number
  category: string
  image: string
  createdAt: Date
  updatedAt: Date
}

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Product slug is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },
    stock: {
      type: Number,
      default: 0,
      min: [0, "Stock cannot be negative"],
    },
    category: {
      type: String,
      default: "",
      trim: true,
    },
    image: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
    // Ensure virtual fields are included when converting to JSON
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

const Product = models.Product || model<IProduct>("Product", productSchema)

export default Product
export type { IProduct }
