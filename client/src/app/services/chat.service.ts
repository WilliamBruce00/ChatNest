import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Chat } from '../model/chat.model';
import { catchError, map, Observable, tap } from 'rxjs';
import { API_URL } from '../constant/constant';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private http: HttpClient) {}

  create(data: Chat): Observable<Chat> {
    return this.http.post<Chat>(API_URL.CHAT, data);
  }

  findPrivateMessage(query: string): Observable<Chat[]> {
    return this.http.get<Chat[]>(`${API_URL.CHAT}/private_message?${query}`);
  }

  findContact(userId: string): Observable<string[]> {
    return this.http.get<string[]>(`${API_URL.CHAT}/contact/${userId}`);
  }

  update(id: string, data: any) {
    return this.http.patch<Chat>(`${API_URL.CHAT}/${id}`, data);
  }

  findMessageByGroup(userId: string): Observable<Chat[]> {
    return this.http.get<Chat[]>(`${API_URL.CHAT}/group/${userId}`);
  }
}
