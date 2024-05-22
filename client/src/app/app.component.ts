import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SocketService } from './services/socket.service';
import { TokenService } from './services/token.service';
import { AuthService } from './services/auth.service';
import { User } from './model/user.model';
import { UserOnlineService } from './services/user-online.service';
import { concatMap, forkJoin, map, of } from 'rxjs';
import { UserService } from './services/user.service';
import Peer from 'peerjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  constructor(
    private socketService: SocketService,
    private tokenService: TokenService,
    private authService: AuthService,
    private userOnlineService: UserOnlineService,
    private userService: UserService
  ) {}

  ngOnInit(): void {}
}
