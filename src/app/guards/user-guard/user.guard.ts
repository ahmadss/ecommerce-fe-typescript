import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core'; 
import { LocalStorageService } from '../../services/storage/local-storage.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';

export const userGuard: CanActivateFn = (route, state) => {
  const localStorageService = inject(LocalStorageService);
  const router = inject(Router);
  const notification = inject(NzNotificationService);
  
  // Check if the user is logged in or if they should not access the route
  const canAccessAdmin = !localStorageService.canAccessProtectedRoutes();

  const canAccessUser = !localStorageService.canAccessUserProtectedRoutes();

  const hasToken = !localStorageService.getToken;

  if(canAccessAdmin){
    notification.error(
      'Access Denied',
      'You do not have permission to access the user dashboard.',
      {nzDuration: 3000},
    );
    router.navigateByUrl("admin/dashboard")
    return false;
  } else if(hasToken==null){
    localStorageService.clear()
    notification.error(
      'Access Denied',
      'You do not Login, Please Login.',
      {nzDuration: 3000},
    );
    router.navigateByUrl("/login")
    return false;
  }

  return true;
};
