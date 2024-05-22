import { OpenProfileService } from './../../../../services/open-profile.service';
import { Component, OnInit } from '@angular/core';
import { TokenService } from '../../../../services/token.service';
import { AuthService } from '../../../../services/auth.service';
import { AddfriendService } from '../../../../services/addfriend.service';
import { AddFriend } from '../../../../model/addfriend.model';
import { concatMap, forkJoin, map, of, takeWhile, throwError } from 'rxjs';
import { User } from '../../../../model/user.model';
import { UserService } from '../../../../services/user.service';
import { API_URL } from '../../../../constant/constant';
import { TimediffPipe } from '../../../../pipes/timediff.pipe';
import { SocketService } from '../../../../services/socket.service';
import Swal from 'sweetalert2';
import { FriendService } from '../../../../services/friend.service';
import { ChatService } from '../../../../services/chat.service';

@Component({
  selector: 'app-request',
  standalone: true,
  imports: [TimediffPipe],
  templateUrl: './request.component.html',
  styleUrl: './request.component.scss',
})
export class RequestComponent implements OnInit {
  requests: any[] = [];

  constructor(
    private tokenService: TokenService,
    private authService: AuthService,
    private addfriendService: AddfriendService,
    private userService: UserService,
    private socketService: SocketService,
    private friendService: FriendService,
    private chatService: ChatService,
    private openProfileService: OpenProfileService
  ) {}

  ngOnInit(): void {
    this.getAddFriend();
    this.updateStatusAddFriend();
  }

  updateStatusAddFriend(): void {
    const token = this.tokenService.getToken();

    this.authService
      .verifyToken(token)
      .pipe(
        concatMap((user: User) => {
          return this.addfriendService.findbyRecipient(user._id || '');
        }),
        concatMap((addfriend: AddFriend[]) => {
          return forkJoin(
            addfriend.map((item: AddFriend) =>
              this.addfriendService.update(item._id || '', { seen: true })
            )
          );
        })
      )
      .subscribe({
        next: (value: any) => {
          this.socketService.emit('add friend');
        },
      });
  }

  getAddFriend(): void {
    const token = this.tokenService.getToken();

    this.authService
      .verifyToken(token)
      .pipe(
        concatMap((user: User) => {
          return this.addfriendService.findbyRecipient(user._id || '');
        }),
        concatMap((addfriend: AddFriend[]) => {
          if (!addfriend.length) {
            return of([]);
          }

          return forkJoin(
            addfriend.map((item: AddFriend) =>
              this.userService.findOne(item.sender || '').pipe(
                map((user: User) => {
                  return {
                    ...user,
                    avatar: `${API_URL.IMAGES}/${user.avatar}`,
                    request: addfriend.find(
                      (af: AddFriend) => af.sender === user._id
                    ),
                  };
                })
              )
            )
          );
        })
      )
      .subscribe({
        next: (value: any) => {
          this.requests = value;
        },
      });
  }

  handleConfirmAddFriend(request: AddFriend): void {
    Swal.fire({
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const token = this.tokenService.getToken();

    this.authService
      .verifyToken(token)
      .pipe(
        concatMap((user: User) => {
          return this.addfriendService.findbyRecipient(user._id || '').pipe(
            concatMap((addfriend: AddFriend[]) => {
              const check = addfriend.find(
                (item: AddFriend) => item.sender === request.sender
              );

              if (check) {
                return forkJoin([
                  this.friendService.create({
                    userID: request.recipient,
                    friendID: request.sender,
                  }),
                  this.friendService.create({
                    userID: request.sender,
                    friendID: request.recipient,
                  }),
                  this.addfriendService.delete(check._id || ''),
                  this.chatService.create({
                    sender: request.recipient,
                    recipient: request.sender,
                    message: request.sender,
                    type: 'accepted add friend',
                  }),
                ]);
              } else {
                Swal.fire({
                  text: 'Lời mời kết bạn không còn nữa',
                  icon: 'error',
                });
                return of(null);
              }
            })
          );
        })
      )
      .subscribe({
        next: (value: any) => {
          this.socketService.emit('message');
          this.socketService.emit('contact');
          this.getAddFriend();
          Swal.close();
        },
      });
  }

  handleCancelAddFriend(request: AddFriend): void {
    const token = this.tokenService.getToken();

    Swal.fire({
      text: 'Bạn có chắc chắn muốn hủy không ?',
      icon: 'warning',
      allowOutsideClick: false,
      showCancelButton: true,
      cancelButtonText: 'Hủy',
    }).then(({ isConfirmed }) => {
      if (isConfirmed) {
        this.authService
          .verifyToken(token)
          .pipe(
            concatMap((user: User) => {
              return this.addfriendService.findbyRecipient(user._id || '');
            }),
            concatMap((addfriend: AddFriend[]) => {
              const check = addfriend.find(
                (item: AddFriend) => item.sender === request.sender
              );

              if (check) {
                Swal.fire({
                  text: 'Xóa thành công',
                  icon: 'success',
                });
                return this.addfriendService.delete(check._id || '');
              } else {
                Swal.fire({
                  text: 'Lời mời kết bạn không còn nữa',
                  icon: 'error',
                });
                return of(null);
              }
            })
          )
          .subscribe({
            next: (value: any) => {
              this.getAddFriend();
            },
          });
      }
    });
  }

  handleOpenProfile(item: User): void {
    this.openProfileService.setData({ open: true, user: item });
  }
}
