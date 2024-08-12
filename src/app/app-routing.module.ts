import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { loginGuard } from './guards/login-guard/login.guard';

const routes: Routes = [
  {
    path:"register", component:RegisterComponent
  },
  {
    path:"login", component:LoginComponent, canActivate:[loginGuard]
  },
  {
    path:"admin", loadChildren:()=>import("./admin/admin.module").then(m => m.AdminModule)
  },
  {
    path:"user", loadChildren:()=>import("./user/user.module").then(u => u.UserModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
