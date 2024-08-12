// src/app/models/category.model.ts
export interface Category {
    code: string;
    name: string;
    description: string;
  }
  
  export interface PaginatedCategoryResponse {
    result: Category[];
    pages: number;
    elements: number;
  }
  