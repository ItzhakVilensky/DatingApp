import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, take } from 'rxjs';
import { AccountService } from '../_services/account.service';
import { IUser } from '../_models/user';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private accoutService: AccountService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.accoutService.currentUser$
      .pipe(
        take(1)
      ).subscribe({
        next: (user: IUser | null) => {
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
