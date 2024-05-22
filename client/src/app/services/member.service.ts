import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Member } from '../model/member.model';
import { Observable } from 'rxjs';
import { API_URL } from '../constant/constant';

@Injectable({
  providedIn: 'root',
})
export class MemberService {
  constructor(private http: HttpClient) {}

  create(data: Member): Observable<Member> {
    return this.http.post<Member>(`${API_URL.MEMBER}`, data);
  }

  findbyUserID(userId: string): Observable<Member[]> {
    return this.http.get<Member[]>(`${API_URL.MEMBER}/userID/${userId}`);
  }
}
