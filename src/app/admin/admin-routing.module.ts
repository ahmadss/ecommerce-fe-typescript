import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { adminGuard } from '../guards/admin-guard/admin.guard';
import { PostCategoryComponent } from './components/post-category/post-category.component';
import { ProductComponent } from './components/product/product.component';
import { CreateProductComponent } from './components/create-product/create-product.component';
import { EditProductComponent } from './components/edit-product/edit-product.component';

const routes: Routes = [
  {path: 'dashboard', component:DashboardComponent, canActivate:[adminGuard]},
  {path: 'category', component:PostCategoryComponent, canActivate:[adminGuard]},
  {path: 'product', component:ProductComponent, canActivate:[adminGuard]},
  {path: 'create-product', component: CreateProductComponent, canActivate:[adminGuard] },
  { path:'edit-product/:id', component: EditProductComponent, canActivate: [adminGuard] },
  {path: '**', redirectTo: 'admin/dashboard' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
