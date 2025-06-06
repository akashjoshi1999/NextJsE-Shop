import BuyButton from "@/components/product/BuyButton"
import Price from "@/components/product/price"
import Image from "next/image"
import { notFound } from "next/navigation"

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  // Await params before accessing its properties
  const { slug } = await params

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

    const res = await fetch(`${baseUrl}/api/product/${slug}`, {
      cache: 'no-store',
    })

    if (!res.ok) {
      return notFound()
    }

    const product = await res.json()

    const productJsonLd = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      description: product.description,
      image: product.image,
      offers: {
        "@type": "Offer",
        priceCurrency: "USD",
        price: product.price,
        availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      },
    }

    return (
      <div className="mx-auto max-w-screen-xl px-4">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
        <div className="flex flex-col gap-8 rounded-lg border border-neutral-200 bg-white p-8 dark:border-neutral-800 dark:bg-black lg:flex-row">
          <div className="w-full lg:w-2/3">
            {/* Product gallery or image placeholder */}
            <form>
              <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden">
                <Image
                  className="h-full w-full object-contain"
                  fill
                  sizes="(min-width: 1024px) 66vw, 100vw"
                  alt={product.name}
                  src={product.image || "/placeholder.svg"}
                  priority={true}
                />
              </div>
            </form>
          </div>
          <div className="w-full lg:w-1/3">
            <div className="mb-6 flex flex-col border-b pb-6 dark:border-neutral-700">
              <h1 className="mb-2 text-5xl font-medium">{product.name}</h1>
              <div className="mr-auto w-auto rounded-full bg-blue-600 p-2 text-sm text-white">
                <Price amount={product.price} currencyCode={"USD"} />
              </div>
            </div>
            {product.description ? (
              <div
                className="mb-6 text-sm leading-tight dark:text-white/[60%] prose mx-auto max-w-6xl text-base leading-7 text-black prose-headings:mt-8 prose-headings:font-semibold prose-headings:tracking-wide prose-headings:text-black prose-h1:text-5xl prose-h2:text-4xl prose-h3:text-3xl prose-h4:text-2xl prose-h5:text-xl prose-h6:text-lg prose-a:text-black prose-a:underline prose-a:hover:text-neutral-300 prose-strong:text-black prose-ol:mt-8 prose-ol:list-decimal prose-ol:pl-6 prose-ul:mt-8 prose-ul:list-disc prose-ul:pl-6 dark:text-white dark:prose-headings:text-white dark:prose-a:text-white dark:prose-strong:text-white"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            ) : null}
            <form>
              <BuyButton product={product} />
            </form>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error loading product:", error)
    return notFound()
  }
}
