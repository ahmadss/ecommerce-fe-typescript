export interface Product {
    id: number;
    title: string;
    description: string;
    imageUrl: string;
    price: number;
    stock: number;
  }

  export interface PaginatedProductResponse {
    result: Product[];
    pages: number;
    elements: number;
  }