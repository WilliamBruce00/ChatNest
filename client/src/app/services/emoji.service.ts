import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../constant/constant';
import { Emoji } from '../model/emoji.model';

@Injectable({
  providedIn: 'root',
})
export class EmojiService {
  constructor(private http: HttpClient) {}

  findAll(): Observable<Emoji[]> {
    return this.http.get<Emoji[]>(API_URL.EMOJI);
  }
}
