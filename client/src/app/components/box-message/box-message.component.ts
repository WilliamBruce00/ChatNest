import {
  AfterViewInit,
  Component,
  DoCheck,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { OpenChatService } from '../../services/open-chat.service';
import { User } from '../../model/user.model';
import { API_URL } from '../../constant/constant';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TokenService } from '../../services/token.service';
import { AuthService } from '../../services/auth.service';
import { ChatService } from '../../services/chat.service';
import {
  concatMap,
  forkJoin,
  interval,
  map,
  mergeMap,
  of,
  switchMap,
} from 'rxjs';
import { SocketService } from '../../services/socket.service';
import { Chat } from '../../model/chat.model';
import { UserService } from '../../services/user.service';
import { DatePipe } from '../../pipes/date.pipe';
import Swal from 'sweetalert2';
import { AddfriendService } from '../../services/addfriend.service';
import { AddFriend } from '../../model/addfriend.model';
import { FriendService } from '../../services/friend.service';
import { Friend } from '../../model/friend.model';
import { OpenProfileService } from '../../services/open-profile.service';
import { UploadService } from '../../services/upload.service';
import { MsgSenderComponent } from '../msg-sender/msg-sender.component';
import { MsgReceiverComponent } from '../msg-receiver/msg-receiver.component';
import { EmojiService } from '../../services/emoji.service';
import { EmojiComponent } from '../emoji/emoji.component';

@Component({
  selector: 'app-box-message',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    DatePipe,
    MsgSenderComponent,
    MsgReceiverComponent,
    EmojiComponent,
  ],
  templateUrl: './box-message.component.html',
  styleUrl: './box-message.component.scss',
})
export class BoxMessageComponent implements OnInit, DoCheck, AfterViewInit {
  @ViewChild('boxmessage') boxmessage!: ElementRef;

  isOpenChat: boolean = false;
  isOpenEmoji: boolean = false;
  receiver!: User;
  message: any;
  form = new FormGroup({
    message: new FormControl('', [Validators.required]),
  });
  statusAddfriend: string = 'request';
  executionTime: number = 0;

  constructor(
    private openChatService: OpenChatService,
    private tokenService: TokenService,
    private authService: AuthService,
    private chatService: ChatService,
    private socketService: SocketService,
    private userService: UserService,
    private addFriendService: AddfriendService,
    private friendService: FriendService,
    private openProfileService: OpenProfileService,
    private uploadService: UploadService
  ) {}

  ngOnInit(): void {
    this.getReceiver();
    this.onSocket();
  }

  ngDoCheck(): void {}

  ngAfterViewInit(): void {}

  getReceiver(): void {
    this.openChatService.getData().subscribe({
      next: (value: any) => {
        this.isOpenChat = value.open;
        this.receiver = {
          ...value.data,
        };
        this.getMessages();
        this.updateStatusMessage();
        this.handleStatusAddFriend();

        console.log(value.type);
      },
    });
  }

  closeChat(): void {
    this.openChatService.setData({ open: false });
  }

  onSocket(): void {
    this.onMessage();
  }

  onMessage(): void {
    this.socketService.onEvent('message').subscribe({
      next: (value: any) => {
        this.getMessages();
        this.updateStatusMessage();
      },
    });
  }

  updateStatusMessage(): void {
    const token = this.tokenService.getToken();

    this.authService
      .verifyToken(token)
      .pipe(
        concatMap((user: User) => {
          return this.chatService
            .findPrivateMessage(
              `sender=${user._id}&recipient=${this.receiver._id}`
            )
            .pipe(
              concatMap((chat: Chat[]) => {
                return forkJoin(
                  chat
                    .filter((item: Chat) => item.sender !== user._id)
                    .map((item: Chat) => {
                      item.seen = [];
                      item.seen?.push(user._id || '');

                      return this.chatService.update(item._id || '', {
                        seen: item.seen,
                      });
                    })
                );
              })
            );
        })
      )
      .subscribe({
        next: (value: any) => {
          this.socketService.emit('contact');
        },
      });
  }

  getMessages(): void {
    const start = performance.now();

    const token = this.tokenService.getToken();

    this.authService
      .verifyToken(token)
      .pipe(
        concatMap((user: User) => {
          return this.chatService.findPrivateMessage(
            `sender=${user._id}&recipient=${this.receiver._id}`
          );
        }),
        concatMap((chat: Chat[]) => {
          if (!chat.length) {
            return of(null);
          }
          return forkJoin(
            chat.map((item: Chat) =>
              this.userService.findOne(item.sender || '')
            )
          ).pipe(
            map((user: User[]) => {
              const data = user
                .map((item: User, index: number) => {
                  return {
                    ...item,
                    avatar: `${API_URL.IMAGES}/${item.avatar}`,
                    message: chat[index],
                  };
                })
                .reduce((acc: any, item: any) => {
                  const date = new Date(item.message.createAt);
                  const day =
                    date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
                  const month =
                    date.getMonth() < 10
                      ? '0' + (date.getMonth() + 1)
                      : date.getMonth() + 1;
                  const year = date.getFullYear();

                  if (!acc[`${day}/${month}/${year}`]) {
                    acc[`${day}/${month}/${year}`] = [];
                  }
                  acc[`${day}/${month}/${year}`].push(item);
                  return acc;
                }, {});

              const output = Object.keys(data)
                .map((date) => ({
                  date,
                  data: data[date].sort(
                    (a: any, b: any) =>
                      new Date(a.message.createAt).getTime() -
                      new Date(b.message.createAt).getTime()
                  ),
                }))
                .reverse();

              return output;
            })
          );
        })
      )
      .subscribe({
        next: (value: any) => {
          if (value) {
            this.message = value.reverse();
            const end = performance.now();
            this.executionTime = end - start;
          }
        },
      });
  }

  onSubmit(): void {
    const { message } = this.form.controls;
    const token = this.tokenService.getToken();

    if (!message.value) {
      return;
    }

    this.authService
      .verifyToken(token)
      .pipe(
        concatMap((user: User) => {
          const data = {
            sender: user._id,
            recipient: this.receiver._id,
            message: message.value || '',
            type: 'message',
          };

          return this.chatService.create(data);
        })
      )
      .subscribe({
        next: (value: any) => {
          this.socketService.emit('message');
          this.socketService.emit('contact');
          this.form.reset();

          this.scrollToBottom();
        },
      });
  }

  handleStatusAddFriend(): void {
    const token = this.tokenService.getToken();

    this.authService
      .verifyToken(token)
      .pipe(
        concatMap((user: User) => {
          return this.friendService.findbyUserID(user._id || '').pipe(
            concatMap((friend: Friend[]) => {
              const check = friend.find(
                (item: Friend) => item.friendID === this.receiver._id
              );

              if (check) {
                return of('friend');
              } else {
                return this.addFriendService.findbySender(user._id || '').pipe(
                  map((addfriend: AddFriend[]) => {
                    return addfriend.find(
                      (item: AddFriend) => item.recipient === this.receiver._id
                    )
                      ? 'pending'
                      : 'request';
                  })
                );
              }
            })
          );
        })
      )
      .subscribe({
        next: (value: string) => {
          this.statusAddfriend = value;
        },
      });
  }

  handleAddFriend(): void {
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
          return this.friendService.findbyUserID(user._id || '').pipe(
            concatMap((friends: Friend[]) => {
              const check = friends.find(
                (friend: Friend) => friend.friendID === this.receiver._id
              );

              if (check) {
                return of(null);
              } else {
                return this.addFriendService.findbySender(user._id || '').pipe(
                  concatMap((addfriend: AddFriend[]) => {
                    const check = addfriend.find(
                      (item: AddFriend) => item.recipient === this.receiver._id
                    );

                    if (check) {
                      return this.addFriendService.delete(check._id || '');
                    } else {
                      if (this.statusAddfriend === 'pending') {
                        return of(null);
                      }

                      return this.addFriendService.create({
                        sender: user._id,
                        recipient: this.receiver._id,
                      });
                    }
                  })
                );
              }
            })
          );
        })
      )
      .subscribe({
        next: (value: any) => {
          this.socketService.emit('add friend');
          this.handleStatusAddFriend();
          Swal.close();
        },
      });
  }

  handleOpenProfile(): void {
    this.openProfileService.setData({ open: true, user: this.receiver });
  }

  sendImage(file: any): void {
    const token = this.tokenService.getToken();

    this.authService
      .verifyToken(token)
      .pipe(
        concatMap((user: User) => {
          return forkJoin(
            Object.values(file.files).map((item: any) =>
              this.uploadService.uploadFile(item).pipe(
                map((image: any) => {
                  return image.img;
                })
              )
            )
          ).pipe(
            concatMap((image: string[]) => {
              const message = {
                sender: user._id,
                recipient: this.receiver._id,
                type: 'image',
                message: image.join(','),
              };
              return this.chatService.create(message);
            })
          );
        })
      )
      .subscribe({
        next: (value: any) => {
          this.socketService.emit('message');
          this.socketService.emit('contact');

          this.scrollToBottom();
        },
      });
  }

  scrollToBottom(): void {
    Swal.fire({
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    if (this.boxmessage) {
      console.log(this.executionTime / 1000);

      setTimeout(() => {
        this.boxmessage.nativeElement.scrollTop =
          this.boxmessage.nativeElement.scrollHeight;

        Swal.close();
      }, this.executionTime);
    }
  }

  sendFile(file: any): void {
    const token = this.tokenService.getToken();

    this.authService
      .verifyToken(token)
      .pipe(
        concatMap((user: User) => {
          return forkJoin(
            Object.values(file.files).map((item: any) =>
              this.uploadService.uploadFile(item).pipe(
                map((file: any) => {
                  return file.img;
                })
              )
            )
          ).pipe(
            concatMap((file: string[]) => {
              const message = {
                sender: user._id,
                recipient: this.receiver._id,
                type: 'file',
                message: file.join(','),
              };
              return this.chatService.create(message);
            })
          );
        })
      )
      .subscribe({
        next: (value: any) => {
          this.socketService.emit('message');
          this.socketService.emit('contact');

          this.scrollToBottom();
        },
      });
  }

  openEmoji(): void {
    this.isOpenEmoji = !this.isOpenEmoji;
  }

  receiveEmoji(data: string): void {
    this.form.controls.message.patchValue(
      this.form.controls.message.value + data
    );
  }
}
