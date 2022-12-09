import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, take } from 'rxjs';
import { AccountService } from '../_services/account.service';
import { User } from '../_models/user';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private accoutService: AccountService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.accoutService.currentUser$
      .pipe(
        take(1) // this method called for auto-unsubscription
      ).subscribe({
        next: (user: User | null) => {
          if (user) {
            request = request.clone({
              setHeaders: {
                Authorization: `Bearer ${user.token}`
              }
            });
          }
        }
      });
    return next.handle(request);
  }
}
