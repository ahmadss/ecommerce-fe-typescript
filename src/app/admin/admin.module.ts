import { NgModule, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NzListModule } from 'ng-zorro-antd/list';


import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzTableModule } from 'ng-zorro-antd/table';


import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PostCategoryComponent } from './components/post-category/post-category.component';
import { PostCategoryService } from '../services/post-category/post-category.service';
import { AuthInterceptor } from '../auth.interceptor';
import { ProductComponent } from './components/product/product.component';
import { ProductService } from '../services/product-services/product.service';
import { EditProductComponent } from './components/edit-product/edit-product.component';
import { CreateProductComponent } from './components/create-product/create-product.component';


@NgModule({
  declarations: [
    DashboardComponent,
    PostCategoryComponent,
    ProductComponent,
    EditProductComponent,
    CreateProductComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    NzLayoutModule,
    NzMenuModule,
    NzButtonModule,
    ReactiveFormsModule,
    NzInputModule,
    NzFormModule,
    NzSpinModule,
    NzSelectModule,
    NzListModule,
    NzCardModule,
    NzPaginationModule,
    NzTableModule
  ],
  providers: [ 
    PostCategoryService,
    ProductService,
    {provide: HTTP_INTERCEPTORS,      
    useClass: AuthInterceptor,      
    multi: true
    }
  ],
})
export class AdminModule { }
