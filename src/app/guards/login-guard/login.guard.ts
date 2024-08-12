import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../services/storage/local-storage.service';

export const loginGuard: CanActivateFn = (route, state) => {
  const localStorageService = inject(LocalStorageService);
  const router = inject(Router);

  // Jika pengguna sudah login, arahkan ke halaman dashboard
  console.log("log ya "+localStorageService.isLoggedIn());
  if (localStorageService.isLoggedIn()) {
    router.navigate(['/dashboard']); // Ganti dengan rute yang sesuai
    return false;
  }
  
  return true;
};
