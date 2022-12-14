import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';
import { PaginationResult } from '../_models/paginaton';
import { UserParams } from '../_models/userParams';

@Injectable({
  providedIn: 'root'
})
export class MembersService {

  baseUrl = environment.apiUrl;
  members: Member[] = [];

  constructor(private http: HttpClient) {

  }

  getMembers(userParams: UserParams): Observable<PaginationResult<Member[]>> {
    let params = this.getPaginationMembers(userParams);

    return this.getPaginatedResult<Member[]>(this.baseUrl + 'users', params)
  }

  private getPaginatedResult<T>(url: string, params: HttpParams): Observable<PaginationResult<T>> {
    const paginatedResult: PaginationResult<T> = new PaginationResult<T>;
    return this.http.get<T>(url, { observe: 'response', params })
      .pipe(
        map(response => {
          if (response.body) {
            paginatedResult.result = response.body;
          }
          const pagination = response.headers.get("pagination");
          if (pagination) {
            paginatedResult.pagination = JSON.parse(pagination);
          }
          return paginatedResult;
        })
      );
  }

  getMember(username: string) {
    const member = this.members.find(x => x.userName == username);
    if (member) return of(member);
    return this.http.get<Member>(this.baseUrl + 'users/' + username);
  }

  updateMember(member: Member) {
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

  getPaginationMembers(userParams: UserParams) {
    let params = new HttpParams();
    params = params.append('pageNumber', userParams.pageNumber);
    params = params.append('pageSize', userParams.pageSize);
    params = params.append('minAge', userParams.minAge);
    params = params.append('maxAge', userParams.maxAge);
    params = params.append('gender', userParams.gender);
    return params;
  }
}
