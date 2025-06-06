import Link from 'next/link';
import { GridTileImage } from './tile';
import { Product } from '@/types/product';
import { useAppSelector } from '@/hooks/useAppSelector';
import { selectProductList } from '@/store/slices/product/productSelectors';

function ThreeItemGridItem({
  item,
  size,
  priority = false, // add priority with default value false
}: {
  item: Product;
  size: 'full' | 'half';
  priority?: boolean;
}) {
  
  return (
    <div
      className={size === 'full' ? 'md:col-span-4 md:row-span-2' : 'md:col-span-2 md:row-span-1'}
    >
      <Link
        className="relative block aspect-square h-full w-full"
        href={`/product/${item.slug}`}
        prefetch={true}
      >
        <GridTileImage
          src={item.image}
          fill
          sizes={
            size === 'full' ? '(min-width: 768px) 66vw, 100vw' : '(min-width: 768px) 33vw, 100vw'
          }
          priority={priority}
          alt={item.name}
          label={{
            position: size === 'full' ? 'center' : 'bottom',
            title: item.name,
            amount: item.price,
            currencyCode: 'USD'
          }}
        />
      </Link>
    </div>
  );
}

export function ThreeItemGrid() {

  const products = useAppSelector(selectProductList);

  if (!products[0] || !products[1] || !products[2]) return null;

  const [firstProduct, secondProduct, thirdProduct] = products;

  return (
    <section className="mx-auto grid max-w-[--breakpoint-2xl] gap-4 px-4 pb-4 md:grid-cols-6 md:grid-rows-2 lg:max-h-[calc(100vh-200px)]">
      <ThreeItemGridItem size="full" item={firstProduct} priority={true} />
      <ThreeItemGridItem size="half" item={secondProduct} priority={true} />
      <ThreeItemGridItem size="half" item={thirdProduct} />
    </section>
  );
}
