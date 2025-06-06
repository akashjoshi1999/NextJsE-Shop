import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Product from '@/models/Product';

export async function GET() {
  try {
    await connectToDatabase();

    const products = await Product.find({});
    return NextResponse.json(products);
  } catch (error) {
    console.error('Fetch products error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, description, price, stock, category, image } = await request.json()

    if (!name || !price) {
      return NextResponse.json({ message: "Name and price are required" }, { status: 400 })
    }

    await connectToDatabase()

    // Generate slug properly - no nullish coalescing needed here
    const slug = name.toLowerCase().replace(/\s+/g, "-")

    const data = {
      name,
      slug,
      description: description || "",
      price,
      stock: stock || 0,
      category: category || "",
      // Use the first image from the images array if available
      image: image || "",
    }
    const newProduct = await Product.create(data)

    return NextResponse.json({ message: "Product created",oldProduct : data,  product: newProduct }, { status: 201 })
  } catch (error) {
    console.error("Create product error:", error)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}