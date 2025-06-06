export interface Product {
    id: string,
    name: string
    image: string
    price: string
    description: string
    stock: number,
    handle: string
    category: string,
    slug: string
}

export interface ProductState {
    productList: Product[]
    loading: boolean
    error: string | null
}
