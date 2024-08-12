import { Component, OnInit } from '@angular/core';
import { PostCategoryService } from '../../../services/post-category/post-category.service';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Category, PaginatedCategoryResponse } from './category.model';
import { LocalStorageService } from '../../../services/storage/local-storage.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-post-category',
  templateUrl: './post-category.component.html',
  styleUrl: './post-category.component.css'
})
export class PostCategoryComponent implements OnInit {

  categoryForm!: FormGroup;
  categories: Category[] = [];
  isSpinning = false;
  errorMessage: string | null = null;
  categoryListDescription: string = 'This is the description for the category list.';
  currentPage: number = 0;
  totalPages: number = 0;
  limit: number = 2;
  totalElements: number = 0;
  searchQuery: string = '';
  editingCategoryId: string | null = null;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private categoryService: PostCategoryService,
    private notification: NzNotificationService,
    private localStorageService: LocalStorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.checkAccess();
  
  }

  private checkAccess(): void {
    const roles = this.localStorageService.getRoles();
    if (roles.value.includes('ROLE_admin')) {
      // If user is admin, allow access to category page
      this.loadCategories();
    } else {
      // If user is not admin, redirect to dashboard
      this.router.navigate(['/admin/dashboard']);
    }
  }

  loadCategories(page: number = this.currentPage): void {
    this.isSpinning = true;
    this.categoryService.getCategories(page, this.limit, this.searchQuery).subscribe(
      (response: PaginatedCategoryResponse) => {
        console.log(response); 
        this.categories = response.result;
        this.totalPages = response.pages;
        this.totalElements = response.elements;
        this.isSpinning = false;
      },
      (error) => {
        this.isSpinning = false;
        this.errorMessage = 'Failed to load categories.';
      }
    );
  }

  onSubmit(): void {
    if (this.categoryForm.valid) {
      this.isSpinning = true;
      const formData = this.categoryForm.value;
      this.categoryService.addCategory(formData).subscribe(
        () => {
          this.loadCategories();
          this.isSpinning = false;
          this.notification.success('Success', 'Category added successfully.');
          this.resetForm();
        },
        (error) => {
          this.isSpinning = false;
          this.errorMessage = 'Failed to add category.';
          this.resetForm();
        }
      );
    }
  }

  deleteCategory(id: string): void {
    this.categoryService.deleteCategory(id).subscribe(
      () => {
        this.loadCategories();
        this.notification.success('Success', 'Category deleted successfully.');
      },
      (error) => {
        this.errorMessage = 'Failed to delete category.';
      }
    );
  }

  initializeForm(): void {
    this.categoryForm = this.fb.group({
      code: [{ value: '', disabled: false }, Validators.required],
      name: ['', Validators.required],
      description: [''],
    });
  }

  changePage(page: number): void {
    this.currentPage = page - 1;
    this.loadCategories(page);
  }

  searchCategories(): void {
    this.loadCategories();
  }

  editCategory(category: any): void {
    this.isEditMode = true;
    this.editingCategoryId = category.id;
    this.categoryForm.patchValue({
      code: category.code,
      name: category.name,
      description: category.description
    });
    // this.categoryForm.get('code')?.disable();
  }

  resetForm(): void {
    this.categoryForm.reset();
    this.initializeForm();
    this.isEditMode = false;
    this.editingCategoryId = null;
  }

}


