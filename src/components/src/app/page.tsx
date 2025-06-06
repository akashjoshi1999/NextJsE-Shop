// src/app/page.tsx (App Router Home Page)
'use client'

import { ThreeItemGrid } from '@/components/product/grid/three-items'
import { Carousel } from '@/components/product/carousel'

export default function HomePage() {

  return (
    <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 relative isolate px-6 pt-14 lg:px-8 mt-16">
      <ThreeItemGrid />
      <Carousel />
    </main>
  )
}
