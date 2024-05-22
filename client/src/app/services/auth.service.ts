import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Login } from '../model/login.model';
import { Observable } from 'rxjs';
import { API_URL } from '../constant/constant';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  login(data: Login): Observable<{ access_token: string }> {
    return this.http.post<{ access_token: string }>(
      `${API_URL.AUTH}/login`,
      data
    );
  }

  verifyToken(token: string | null): Observable<any> {
    const headers = new HttpHeaders({
      authorization: `Bearer ${token}`,
    });

    return this.http.get<any>(`${API_URL.AUTH}/status`, { headers });
  }
}
