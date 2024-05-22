import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Email } from '../model/email.model';
import { Observable } from 'rxjs';
import { API_URL } from '../constant/constant';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  constructor(private http: HttpClient) {}

  sendMail(data: Email): Observable<any> {
    return this.http.post<any>(API_URL.EMAIL, data);
  }
}
