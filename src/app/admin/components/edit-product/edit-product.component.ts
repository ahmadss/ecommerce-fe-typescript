import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../services/product-services/product.service';
import { PostCategoryService } from '../../../services/post-category/post-category.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalStorageService } from '../../../services/storage/local-storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { PaginatedCategoryResponse } from '../post-category/category.model';
import { Product } from './product.model';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.css'
})
export class EditProductComponent {
  productForm!: FormGroup;
  imagePreview: string | ArrayBuffer | null = null;
  categories: any[] = [];
  productId: string | null= ""; // ID produk yang sedang diedit

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: PostCategoryService,
    private localStorageService: LocalStorageService,
    private route: ActivatedRoute,
    private router: Router,
    private notification: NzNotificationService
  ) {}

  ngOnInit() {
    this.productId = this.route.snapshot.paramMap.get('id');
    console.log("secureid"+this.productId);
    
    this.productForm = this.fb.group({
      title: ['', Validators.required],
      categories: [[], Validators.required],
      description: ['', Validators.required],
      image: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
    });
    this.loadCategories();
    this.loadProductDetails();
  }

  loadCategories(): void {
    const roles = this.localStorageService.getRoles();
    if (roles.value.includes('ROLE_admin')) {
      this.categoryService.getCategories(0, 1000, '').subscribe(
        (response: PaginatedCategoryResponse) => {
          this.categories = response.result;
        },
        (error) => {
          console.error('Failed to load categories', error);
        }
      );
    } else {
      this.router.navigate(['/admin/dashboard']);
    }
  }

  loadProductDetails(): void {
    const roles = this.localStorageService.getRoles();
    if (roles.value.includes('ROLE_admin')) {
      const productIdString = `${this.productId}`;
      this.productService.getProductById(productIdString).subscribe(
        (product: Product) => {
          this.productForm.patchValue({
            title: product.title,
            categories: product.categories,
            description: product.description,
            price: product.price,
            stock: product.stock
          });
          this.imagePreview = `http://localhost:8089/${product.image}`;
        },
        (error) => {
          console.error('Failed to load product details', error);
        }
      );
    }
  }

  onSubmit() {
    if (this.productForm.valid) {
      const formValue = this.productForm.value;
      const formData = {
        title: formValue.title,
        categories: formValue.categories,
        description: formValue.description,
        image: formValue.image.split(',')[1], // Menghapus prefix data URL jika diubah
        price: formValue.price,
        stock: formValue.stock
      };
      const productIdString = `${this.productId}`;
      this.productService.updateProduct(productIdString, formData).subscribe(
        response => {
          this.notification.success('Success', 'Product updated successfully!');
          this.router.navigate(['/product']);
        },
        error => {
          this.notification.error('Error', 'Failed to update product. Please try again.');
        }
      );
    }
  }

  onReset() {
    this.productForm.reset();
    if (this.productId) {
      this.productService.getProductById(this.productId).subscribe(
        (product: Product) => {
          this.productForm.patchValue({
            title: product.title,
            categories: product.categories,
            description: product.description,
            image: product.image,
            price: product.price,
            stock: product.stock
          });
          this.imagePreview = `http://localhost:8089/${product.image}`;
        },
        (error) => {
          console.error('Failed to reset product details', error);
        }
      );
    }
    this.imagePreview = null;
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
        this.productForm.patchValue({
          image: e.target.result
        });
      };
      reader.readAsDataURL(file);
    }
  }
}
