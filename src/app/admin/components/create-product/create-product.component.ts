import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../services/product-services/product.service';
import { PostCategoryService } from '../../../services/post-category/post-category.service';
import { FormBuilder, FormGroup,  Validators } from '@angular/forms';
import { LocalStorageService } from '../../../services/storage/local-storage.service';
import { Router } from '@angular/router';
import { PaginatedCategoryResponse } from '../post-category/category.model';
import { NzNotificationService } from 'ng-zorro-antd/notification';


@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrl: './create-product.component.css'
})
export class CreateProductComponent implements OnInit{
  productForm!: FormGroup;
  

  imagePreview: string | ArrayBuffer | null = null;

  selectedCategories: any[] = [];

  categories: any[] = [];

  constructor(private fb: FormBuilder,private productService: ProductService, private categoryService: PostCategoryService, private localStorageService: LocalStorageService, private router: Router, private notification: NzNotificationService) {
    this.productForm = this.fb.group({
      title: ['', Validators.required],
      categories: [[]],
      description: ['', Validators.required],
      image: [''], // Placeholder untuk Base64 image
      price: ['', Validators.required],
      stock: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.productForm = this.fb.group({
      title: ['', Validators.required],
      categories: [[], Validators.required],
      description: ['', Validators.required],
      image: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
    });
    this.loadCategories();
  }

  loadCategories(): void {
    const roles = this.localStorageService.getRoles();
    if (roles.value.includes('ROLE_admin')) {
    this.categoryService.getCategories(0, 1000, '').subscribe(
      (response: PaginatedCategoryResponse) => {
        console.log(response); 
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

  onSubmit() {
    if (this.productForm.valid) {
      const formValue = this.productForm.value;
      const formData = {
        title: formValue.title,
        categories: formValue.categories,
        description: formValue.description,
        image: formValue.image.split(',')[1], // Menghapus prefix data URL
        price: formValue.price,
        stock: formValue.stock
      };

      // Kirim data ke server
      console.log(JSON.stringify(formData));
      // Tambahkan logika pengiriman data ke server di sini

      this.productService.createProduct(formData).subscribe(
        response => {
          // Menampilkan notifikasi sukses
          this.notification.success('Success', 'Product created successfully!');
          
          // Arahkan ke halaman produk
          this.router.navigate(['/product']);
        },
        error => {
          // Menampilkan notifikasi error
          this.notification.error('Error', 'Failed to create product. Please try again.');
        }
      );
    }
  }
    
  onReset() {
    this.productForm.reset(); // Mengatur ulang formulir
    this.productForm.patchValue({
      price: 0,  // Mengatur nilai default untuk price
      stock: 0   // Mengatur nilai default untuk stock
    });
    this.imagePreview = null; // Menghapus preview gambar
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result; // Preview gambar
        this.productForm.patchValue({
          image: e.target.result // Menyimpan Base64 image di form
        });
      };
      reader.readAsDataURL(file); // Mengonversi file ke Base64
    }
  }

  }


