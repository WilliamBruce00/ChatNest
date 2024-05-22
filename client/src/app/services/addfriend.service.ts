import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AddFriend } from '../model/addfriend.model';
import { Observable } from 'rxjs';
import { API_URL } from '../constant/constant';

@Injectable({
  providedIn: 'root',
})
export class AddfriendService {
  constructor(private http: HttpClient) {}

  create(data: AddFriend): Observable<AddFriend> {
    return this.http.post<AddFriend>(API_URL.ADDFRIEND, data);
  }

  findOne(id: string): Observable<AddFriend> {
    return this.http.get<AddFriend>(`${API_URL.ADDFRIEND}/${id}`);
  }

  findbyRecipient(id: string): Observable<AddFriend[]> {
    return this.http.get<AddFriend[]>(`${API_URL.ADDFRIEND}/recipient/${id}`);
  }

  findbySender(id: string): Observable<AddFriend[]> {
    return this.http.get<AddFriend[]>(`${API_URL.ADDFRIEND}/sender/${id}`);
  }

  delete(id: string): Observable<any> {
    return this.http.delete<any>(`${API_URL.ADDFRIEND}/${id}`);
  }

  update(id: string, data: AddFriend): Observable<AddFriend> {
    return this.http.patch<AddFriend>(`${API_URL.ADDFRIEND}/${id}`, data);
  }
}
