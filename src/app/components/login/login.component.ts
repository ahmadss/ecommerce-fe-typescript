import { Component } from '@angular/core';
import { AuthService } from '../../services/auth-services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../services/storage/local-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm!: FormGroup;
  isSpinning = false;
  errorMessage: string | null = null;

  constructor(private authService: AuthService, private fb:FormBuilder, private localStorageService: LocalStorageService, private router: Router){}

  ngOnInit(){
    this.loginForm = this.fb.group({
      username: [null, [Validators.required]],
      password:[null, [Validators.required]]
    })
    // if (this.localStorageService.canAccessProtectedRoutes()) {
    //   this.router.navigate(['/admin/dashboard']); // Redirect if logged in
    // } else if(this.localStorageService.canAccessUserProtectedRoutes()){
    //   this.router.navigate(['/user/dashboard']); 
    // }
  }

  onSubmit(){
    if (this.loginForm.valid) {
      this.isSpinning = true;
      const formData = this.loginForm.value;
      console.log('Login Form Payload:', formData); // Console log the payload
      this.authService.login(formData).subscribe(

        (res) => {
          console.log('Login Response:', res);
          this.isSpinning = false;
          console.log("res id"+res.id);
          console.log("res username"+res.username);
          console.log("res token ya "+res.token);
          this.localStorageService.setUserId(res.id);
          this.localStorageService.setUserName(res.username);
          this.localStorageService.setRoles(res.roles);
          this.localStorageService.setToken(res.token);
          // Navigate to dashboard or home page upon successful login
          const roles = this.localStorageService.getRoles().getValue();
          if (roles.includes('ROLE_admin')) {
            this.router.navigate(['/admin/dashboard']);
          } else if (roles.includes('ROLE_user')) {
            this.router.navigate(['/user/dashboard']);
          } else if (roles.includes('ROLE_admin') && roles.includes('ROLE_user')) {
            this.router.navigate(['/admin/dashboard']);
          }
        },
        (err) => {
          console.error('Login Error:', err);
          this.isSpinning = false;
          if (err.status === 403) {
            this.errorMessage = 'Login Failed chek username or password.';
          } else {
            this.errorMessage = 'An error occurred. Please try again later.';
          }
          
        }
      );
    }
  }

  // Getter methods for easier access in the template
  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }

  
}
