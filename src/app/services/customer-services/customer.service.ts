import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environments';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../../user/components/dashboard/Product.model';

const BASIC_URL = environment["BASIC_URL"]

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private http: HttpClient) {}

  getProducts(page: number, limit: number): Observable<any> {
    const params = new HttpParams()
      .set('pages', page.toString())
      .set('limit', limit.toString());

    return this.http.get<any>(`${BASIC_URL}product`, { params });
  }
}
