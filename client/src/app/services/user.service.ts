import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../model/user.model';
import { catchError, concatMap, Observable, tap } from 'rxjs';
import { API_URL } from '../constant/constant';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private tokenService: TokenService
  ) {}

  create(data: User): Observable<User> {
    return this.http.post<User>(API_URL.USER, data);
  }

  findAll(): Observable<User[]> {
    return this.http.get<User[]>(API_URL.USER);
  }

  findOne(id: string): Observable<User> {
    return this.http.get<User>(`${API_URL.USER}/${id}`);
  }

  update(id: string, data: User): Observable<User> {
    return this.http.patch<User>(`${API_URL.USER}/${id}`, data);
  }

  delete(id: string): Observable<any> {
    return this.http.delete<any>(`${API_URL.USER}/${id}`);
  }

  searchkeyword(keyword: string): Observable<User[]> {
    return this.http.get<User[]>(`${API_URL.USER}/search/${keyword}`);
  }
}
