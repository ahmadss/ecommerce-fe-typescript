import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaginatedCategoryResponse } from '../../admin/components/post-category/category.model';

const BASIC_URL = environment["BASIC_URL"]

@Injectable({
  providedIn: 'root'
})
export class PostCategoryService {

  constructor(private http: HttpClient) { }


  getCategories(page: number = 0, pageSize: number = 2, searchquery: string = ''): Observable<PaginatedCategoryResponse> {
    if(page > 0){
      page = page - 1;
    }
    return this.http.get<PaginatedCategoryResponse>(`${BASIC_URL}category?pages=${page}&limit=${pageSize}&categoryName=${searchquery}`);
  }

  getCategoriesNoPaging(): Observable<any[]> {
    return this.http.get<any[]>(`${BASIC_URL}category?pages=0&limit=100`);
  }

  addCategory(category: any): Observable<any> {
    return this.http.post<any>(BASIC_URL+"category", category);
  }

  deleteCategory(id: string): Observable<any> {
    return this.http.delete<any>(`${BASIC_URL+"category"}/${id}`);
  }


}

