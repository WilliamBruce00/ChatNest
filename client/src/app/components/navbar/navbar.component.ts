import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TokenService } from '../../services/token.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../model/user.model';
import { concatMap, forkJoin, map, of, throwError } from 'rxjs';
import { UserService } from '../../services/user.service';
import { API_URL } from '../../constant/constant';
import { SocketService } from '../../services/socket.service';
import { ChatService } from '../../services/chat.service';
import { AddfriendService } from '../../services/addfriend.service';
import { AddFriend } from '../../model/addfriend.model';
import { Chat } from '../../model/chat.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  user!: User;
  message: number = 0;
  addfriend: number = 0;

  constructor(
    private tokenService: TokenService,
    private authService: AuthService,
    private userService: UserService,
    private socketService: SocketService,
    private chatService: ChatService,
    private addFriendService: AddfriendService
  ) {}

  ngOnInit(): void {
    this.getUser();
    this.onSocket();
    this.notificationAddFriend();
    this.notificationMessage();
  }

  getUser(): void {
    const token = this.tokenService.getToken();

    this.authService.verifyToken(token).subscribe({
      next: (value: User) => {
        this.user = { ...value, avatar: `${API_URL.IMAGES}/${value.avatar}` };
      },
    });
  }

  onSocket(): void {
    this.onAddFriend();
    this.onMessage();
  }

  onAddFriend(): void {
    this.socketService.onEvent('add friend').subscribe({
      next: (value: any) => {
        this.notificationAddFriend();
      },
    });
  }

  onMessage(): void {
    this.socketService.onEvent('contact').subscribe({
      next: (value: any) => {
        this.notificationMessage();
      },
    });
  }

  notificationAddFriend(): void {
    const token = this.tokenService.getToken();

    this.authService
      .verifyToken(token)
      .pipe(
        concatMap((user: User) => {
          return this.addFriendService.findbyRecipient(user._id || '');
        })
      )
      .subscribe({
        next: (value: AddFriend[]) => {
          this.addfriend = value.filter((item: AddFriend) => !item.seen).length;
        },
      });
  }

  notificationMessage(): void {
    const token = this.tokenService.getToken();

    this.authService
      .verifyToken(token)
      .pipe(
        concatMap((user: User) => {
          return this.chatService.findContact(user._id || '').pipe(
            concatMap((contact: string[]) => {
              return forkJoin(
                contact.map((item: string) =>
                  this.chatService
                    .findPrivateMessage(`sender=${user._id}&recipient=${item}`)
                    .pipe(
                      map((chat: Chat[]) => {
                        return chat.filter(
                          (item: Chat) =>
                            item.sender !== user._id &&
                            !item.seen?.includes(user._id || '')
                        );
                      })
                    )
                )
              );
            })
          );
        })
      )
      .subscribe({
        next: (value: any) => {
          this.message = value.flat().length;
        },
      });
  }
}
