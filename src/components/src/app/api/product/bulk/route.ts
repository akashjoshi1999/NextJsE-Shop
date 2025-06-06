import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Product from '@/models/Product';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!Array.isArray(body)) {
      return NextResponse.json({ message: 'Expected an array of products' }, { status: 400 });
    }

    await connectToDatabase();

    const newProducts = body.map(product => {
      const { name, description, price, category, stock, image } = product;

      if (!name || !price) {
        throw new Error('Each product must include name and price');
      }

      return {
        name,
        slug: name.toLowerCase().replace(/\s+/g, '-') ?? '-',
        description: description || '',
        price,
        category: category || "",
        stock: stock || 0,
        image
      };
    });
    
    const inserted = await Product.insertMany(newProducts);

    return NextResponse.json({ message: 'Products created', products: inserted }, { status: 201 });
  } catch (error) {
    console.error('Bulk create product error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

