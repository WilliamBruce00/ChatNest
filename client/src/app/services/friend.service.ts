import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Friend } from '../model/friend.model';
import { Observable } from 'rxjs';
import { API_URL } from '../constant/constant';

@Injectable({
  providedIn: 'root',
})
export class FriendService {
  constructor(private http: HttpClient) {}

  create(data: Friend): Observable<Friend> {
    return this.http.post<Friend>(API_URL.FRIEND, data);
  }

  findbyUserID(id: string): Observable<Friend[]> {
    return this.http.get<Friend[]>(`${API_URL.FRIEND}/userID/${id}`);
  }

  delete(id: string): Observable<any> {
    return this.http.delete<any>(`${API_URL.FRIEND}/${id}`);
  }
}
