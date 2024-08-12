// src/app/models/category.model.ts
export interface Product {
    id: number;
    secure_id: string;
    title: string;
    image: string;
    price:number,
    stock: number,
    description: string;
  }
  
  export interface PaginatedProductResponse {
    result: Product[];
    pages: number;
    elements: number;
  }
  