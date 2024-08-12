import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-services/auth.service';
import { RolesService } from '../../services/roles/roles.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  isSpinning = false;
  roleNames: string[] = [];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private rolesService: RolesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}')
      ]],
      confirmPassword: ['', Validators.required],
      username: ['', Validators.required],
      role_names: [[], [Validators.required]]
    }, {
      validator: this.passwordMatchValidator  // Custom validator to match password and confirmPassword
    });

    this.loadRoles();
  }

  loadRoles(): void {
    this.rolesService.getRoleNames().subscribe(
      (roles) => {
        this.roleNames = roles;
      },
      (error) => {
        console.error('Failed to load roles', error);
      }
    );
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isSpinning = true;
      // Prepare payload without confirmPassword
      const formData = { ...this.registerForm.value };
      delete formData.confirmPassword;
      console.log('Register Form Payload:', formData); // Console log the payload
      this.authService.register(formData).subscribe(
        (res) => {
          console.log(res);
          this.isSpinning = false;
          this.router.navigate(['/login']);  // Redirect to login page on success
        },
        (err) => {
          console.error(err);
          this.isSpinning = false;
        }
      );
    }
  }

  private passwordMatchValidator(form: FormGroup): void {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    if (password !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ mustMatch: true });
    }
  }

  // Getter methods for easier access in the template
  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }

  get username() {
    return this.registerForm.get('username');
  }

  get role_names() {
    return this.registerForm.get('role_names');
  }
}
