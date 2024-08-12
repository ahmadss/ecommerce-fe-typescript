import { LocalStorageService } from '../../services/storage/local-storage.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit{
  isAdminLoggedIn: boolean = false;
  isUserLoggedIn: boolean = false;
  userName: string | null = null;
  

  constructor(private localStorageService: LocalStorageService, private router: Router) {}

  ngOnInit(): void {
    this.localStorageService.getRoles().subscribe(roles => {
      this.isAdminLoggedIn = roles.includes('ROLE_admin');
      this.isUserLoggedIn = roles.includes('ROLE_user');
    });
    this.localStorageService.getUserName().subscribe(userName => {
      this.userName = userName;
    });
    
  }


  logout(): void {
    this.localStorageService.clear();
    this.isAdminLoggedIn = false;
    this.userName = null;
    this.router.navigate(['/login']);
  };

  isLoginPage(): boolean {
    return this.router.url === '/login' || this.router.url === '/register';
  }
}
  

