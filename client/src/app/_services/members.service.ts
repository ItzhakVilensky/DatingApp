import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of, take } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IMember } from '../_models/member';
import { PaginationResult } from '../_models/paginaton';
import { IUser } from '../_models/user';
import { UserParams } from '../_models/userParams';
import { AccountService } from './account.service';
import { getPaginatedResult, getPaginationHeaders } from './paginationHelper';

@Injectable({
  providedIn: 'root'
})
export class MembersService {

  baseUrl = environment.apiUrl;
  members: IMember[] = [];
  memberCache = new Map();// pagination - key, result - value
  userParams: UserParams | undefined;
  user: IUser | undefined;

  constructor(
    private http: HttpClient,
    private accountService: AccountService) {
    this.accountService.currentUser$
      .pipe(
        take(1)
      ).subscribe((user) => {
        if (user) {
          this.userParams = new UserParams(user);
          this.user = user;
        }
      });
  }

  getUserParams() {
    return this.userParams;
  }

  setUserParams(params: UserParams) {
    this.userParams = params;
  }

  resetUserParams() {
    if (this.user) {
      this.userParams = new UserParams(this.user);
      return this.userParams;
    }
    return;
  }

  getMembers(userParams: UserParams): Observable<PaginationResult<IMember[]>> {
    const response = this.memberCache.get(Object.values(userParams).join("-"));

    if (response) return of(response);

    let params = getPaginationHeaders(userParams.pageNumber, userParams.pageSize);

    params = params.append('minAge', userParams.minAge);
    params = params.append('maxAge', userParams.maxAge);
    params = params.append('gender', userParams.gender);
    params = params.append('orderBy', userParams.orderBy);

    return getPaginatedResult<IMember[]>(this.baseUrl + 'users', params, this.http)
      .pipe(
        map(response => {
          this.memberCache.set(Object.values(userParams).join("-"), response)
          return response;
        })
      );
  }

  getMember(username: string) {
    const member = [...this.memberCache.values()]
      .reduce((arr, elem) => arr.concat(elem.result), [])
      .find((member: IMember) => member.userName === username);

    if (member) return of(member);
    return this.http.get<IMember>(this.baseUrl + 'users/' + username);
  }

  updateMember(member: IMember) {
    return this.http.put(this.baseUrl + 'users/', member)
      .pipe(
        map(() => {
          const index = this.members.indexOf(member);
          this.members[index] = { ...this.members[index], ...member }
        })
      )
  }

  setMainPhoto(photoId: number) {
    return this.http.put(this.baseUrl + 'users/set-main-photo/' + photoId, {});
  }

  deletePhoto(photoId: number) {
    return this.http.delete(this.baseUrl + 'users/delete-photo/' + photoId);
  }

  addLike(username: string) {
    return this.http.post(this.baseUrl + 'likes/' + username, {});
  }

  getLikes(predicate: string, pageNumber: number, pageSize: number) {
    let params = getPaginationHeaders(pageNumber, pageSize);
    params = params.append('predicate', predicate);
    return getPaginatedResult<IMember[]>(this.baseUrl + 'likes', params, this.http);
  }
}
