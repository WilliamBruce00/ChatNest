import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OTP } from '../model/otp.model';
import { Observable } from 'rxjs';
import { API_URL } from '../constant/constant';

@Injectable({
  providedIn: 'root',
})
export class OtpService {
  constructor(private http: HttpClient) {}

  create(data: OTP): Observable<OTP> {
    return this.http.post<OTP>(API_URL.OTP, data);
  }

  findOne(id: string): Observable<OTP> {
    return this.http.get<OTP>(`${API_URL.OTP}/${id}`);
  }

  update(id: string, data: OTP): Observable<OTP> {
    return this.http.patch<OTP>(`${API_URL.OTP}/${id}`, data);
  }

  delete(id: string): Observable<any> {
    return this.http.delete<any>(`${API_URL.OTP}/${id}`);
  }
}
