import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../services/product-services/product.service';
import { PaginatedProductResponse, Product } from './product.model';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../../services/storage/local-storage.service';
import { environment } from '../../../../environments/environments';
import { HttpHeaders } from '@angular/common/http';
import { blob } from 'stream/consumers';
import { NzNotificationService } from 'ng-zorro-antd/notification';

const BASIC_URL = environment["BASIC_URL"]

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit{
  products: Product[] = [];
  totalElements = 0;
  currentPage = 1;
  pageSize = 5; // Jumlah item per halaman
  isSpinning = false; // Status untuk nz-spin
  searchQuery = '';// Jumlah item per halaman
  showPagination = true;
  productImages: { [key: string]: string } = {};

  

  constructor(private productService: ProductService, private router: Router, private localStorageService: LocalStorageService, private notification: NzNotificationService) {}

  ngOnInit() {
    this.checkAccess();
  }

  loadProducts(page: number =  this.currentPage) {
    this.isSpinning = true; // Mulai spin
    this.productService.getProducts(page, this.pageSize, this.searchQuery).subscribe(
      (response: PaginatedProductResponse) => {
      console.log(response); 
      this.products = response.result;
      this.totalElements = response.elements;
      this.isSpinning = false; // Selesai spin
    }, error => {
      this.isSpinning = false; // Selesai spin walaupun error
      console.error('Error loading products', error);
    });

    this.products.forEach(product => {
      this.fetchImage(product.image);
    });
  }

  prepareImageSrc(imagePath: string): string {
    console.log("basic "+BASIC_URL+`${imagePath}`);
    return BASIC_URL+`${imagePath}`; 
  }

  private checkAccess(): void {
    const roles = this.localStorageService.getRoles();
    if (roles.value.includes('ROLE_admin')) {
      // If user is admin, allow access to category page
      this.loadProducts();
      this.showPagination = this.products.length > this.pageSize;
    } else {
      // If user is not admin, redirect to dashboard
      this.router.navigate(['/admin/dashboard']);
    }
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadProducts(page);
  }

  onSearch() {
    this.currentPage = 0; // Reset ke halaman pertama saat mencari
    this.loadProducts(this.currentPage);
  }

  onEdit(product: any): void {
    // Misalnya, mengarahkan ke halaman edit dengan ID produk
    this.router.navigate(['/edit-product', product.secure_id]);
  }
  onDelete(product: string): void {
    const productIdString = `${product}`;
    if (productIdString!=null) {
      this.productService.deleteProduct(productIdString).subscribe(
        () => {
          this.notification.success('Success', 'Product deleted successfully!');

          this.onSearch();
        },
        () => {
          this.notification.error('Error', 'Failed to delete product. Please try again.');
        }
      );
    }
  }

  editCategory(category: any): void {
            
    
    // this.categoryForm.get('code')?.disable();
  }

  fetchImage(imagePath: string): void {
    const token = this.localStorageService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    this.productService.fetchImage(imagePath, token).subscribe(blob => {
      // const url = window.URL.createObjectURL(blob);
      // this.imageUrl = url;
      const url = window.URL.createObjectURL(blob);
      this.productImages[imagePath] = url;
    })
    
  }
  
}
