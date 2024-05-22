import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../constant/constant';

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  constructor(private http: HttpClient) {}

  uploadFile(file: File): Observable<{ img: string }> {
    const fd = new FormData();
    fd.append('file', file);
    return this.http.post<{ img: string }>(API_URL.UPLOAD, fd);
  }
}
