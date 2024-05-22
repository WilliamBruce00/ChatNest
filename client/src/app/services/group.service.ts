import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Group } from '../model/group.model';
import { Observable } from 'rxjs';
import { API_URL } from '../constant/constant';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  constructor(private http: HttpClient) {}

  create(data: Group): Observable<Group> {
    return this.http.post<Group>(API_URL.GROUP, data);
  }

  findOne(id: string): Observable<Group> {
    return this.http.get<Group>(`${API_URL.GROUP}/${id}`);
  }
}
