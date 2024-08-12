import { Component, HostListener, OnInit } from '@angular/core';
import { PaginatedProductResponse, Product } from './Product.model';
import { CustomerService } from '../../../services/customer-services/customer.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  products: Product[] = [];
  page = 0;
  limit = 5;
  isLoading = false;
  hasMoreData = true;

  constructor(private productService: CustomerService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    if (this.isLoading || !this.hasMoreData) {
      return; // Menghindari pemanggilan yang sama saat loading atau tidak ada data lebih lanjut
    }
    this.isLoading = true;

    this.productService.getProducts(this.page, this.limit).subscribe(
      (response: PaginatedProductResponse) => {
        this.products = [...this.products, ...response.result];
        this.isLoading = false;

        this.hasMoreData = this.page < response.pages;

        console.log("more data" +this.hasMoreData);

        
      },
      (error) => {
        console.error('Failed to load products', error);
        this.isLoading = false;
      }
    );
  }

  

  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight && !this.isLoading) {
      if (this.hasMoreData) {
        this.page++; // Jika ada data lebih lanjut, increment halaman
      }
      this.loadProducts();
    }
  }
}


