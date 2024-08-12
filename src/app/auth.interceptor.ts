import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private notification: NzNotificationService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');
    console.log("roken interceptos "+token);
    // Do not add token for login or register API
    if (req.url.includes('/login') || req.url.includes('/register') || req.url.includes('/login')) {
      return next.handle(req);
    }

    const authReq = token ? req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    }) : req;

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.notification.error('Unauthorized', 'Your session has expired. Please login again.', { nzDuration: 3000 });
          this.router.navigate(['/login']);
        } else if (error.status === 403) {
          this.notification.error('Forbidden', 'You do not have permission to access this resource.', { nzDuration: 3000 });
        }
        return throwError(error);
      })
    );
  }
}
