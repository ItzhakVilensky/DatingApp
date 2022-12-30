import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IUser } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  baseUrl = environment.apiUrl;
  private currentUserSource = new BehaviorSubject<IUser | null>(null);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient) {
  }

  login(model: any): Observable<void> {
    return this.http.post<IUser>(this.baseUrl + 'account/login', model)
      .pipe(
        map((user: IUser) => {
          if (user) {
            this.setCurrentUser(user);
          }
        })
      );
  }

  register(model: any): Observable<IUser> {
    return this.http.post<IUser>(this.baseUrl + 'account/register', model)
      .pipe(
        map((user: IUser) => {
          if (user) {
            this.setCurrentUser(user);
          }
          return user;
        }));
  }

  setCurrentUser(user: IUser) {
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSource.next(user);
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
  }
}
