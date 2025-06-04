import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Product from "@/models/Product"

// GET product by slug
export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    // Await params before accessing its properties
    const { slug } = await params
    console.log("Fetching product by slug:", slug)

    if (!slug || typeof slug !== "string") {
      return NextResponse.json({ message: "Invalid product slug" }, { status: 400 })
    }

    await connectToDatabase()

    const product = await Product.findOne({ slug })

    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error("Get product by slug error:", error)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}

// PUT update product by ID (not slug!)
export async function PUT(request: Request, context: { params: Promise<{ slug: string }> }) {
  try {
    // Await params before accessing its properties
    const { slug } = await context.params
    const updates = await request.json()

    await connectToDatabase()

    if (updates.name) {
      updates.slug = updates.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")
    }

    const updatedProduct = await Product.findOneAndUpdate({ slug }, updates, { new: true })

    if (!updatedProduct) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({
      message: "Product updated",
      changes: updates,
      product: updatedProduct,
    })
  } catch (error) {
    console.error("Update product error:", error)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}

// DELETE product by slug
export async function DELETE(request: Request, context: { params: Promise<{ slug: string }> }) {
  try {
    // Await params before accessing its properties
    const { slug } = await context.params

    await connectToDatabase()

    const deletedProduct = await Product.findOneAndDelete({ slug })

    if (!deletedProduct) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Product deleted" })
  } catch (error) {
    console.error("Delete product error:", error)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}
