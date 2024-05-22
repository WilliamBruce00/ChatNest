import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket = io('http://localhost:3000');

  constructor() {}

  emit(event: string, data?: any): void {
    this.socket.emit(event, data);
  }

  onEvent(event: string): Observable<any> {
    return new Observable<any>((observer) => {
      this.socket.on(event, (data: any) => observer.next(data));
    });
  }
}
