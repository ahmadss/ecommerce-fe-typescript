import { CanActivateFn, Router  } from '@angular/router';
import { inject } from '@angular/core'; 
import { LocalStorageService } from '../../services/storage/local-storage.service';

export const noAuthGuard: CanActivateFn = (route, state) => {
  const localStorageService = inject(LocalStorageService);
  const router = inject(Router);
  
  // Check if the user is logged in or if they should not access the route
  const canAccessAdmin = !localStorageService.canAccessProtectedRoutes();

  const canAccessUser = !localStorageService.canAccessUserProtectedRoutes();
  
  if (canAccessAdmin) {
    router.navigateByUrl("admin/dashboard")
    return false;
  } else if(canAccessUser){
    router.navigateByUrl("user/dashboard")
    return false;
  } 

  return true;
};
