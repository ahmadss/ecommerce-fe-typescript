import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';

const BASIC_URL = environment["BASIC_URL"]

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) {}

  getProducts(page: number, pageSize: number, searchquery: string = ''): Observable<any> {
    if(page > 0){
      page = page - 1;
    }
    return this.http.get<any>(`${BASIC_URL}product?pages=${page}&limit=${pageSize}&productTitle=${searchquery}`);
  }

  createProduct(product: any): Observable<any> {
    return this.http.post(`${BASIC_URL}product`, product);
  }


  fetchImage(imagePath: string, token: string | null= ""): Observable<any>  {
    // const token = this.localStorageService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(`http://localhost:8089/${imagePath}`, {
      headers: headers,
      responseType: 'blob'
    });
    
  }

  getProductById(id: string): Observable<any> {
    return this.http.get(`${BASIC_URL}product/${id}`);
  }

  updateProduct(productId: string | null, productData: any): Observable<any> {
    console.log('Product Data:', productData); 
    return this.http.put(`${BASIC_URL}product/${productId}`, productData);
  }

  deleteProduct(productId: string): Observable<any> {
    return this.http.delete(`${BASIC_URL}product/${productId}`);
  }
  
}
