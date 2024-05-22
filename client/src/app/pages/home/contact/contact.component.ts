import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { ContactItemComponent } from '../../../components/contact-item/contact-item.component';
import { UserService } from '../../../services/user.service';
import { User } from '../../../model/user.model';
import { API_URL } from '../../../constant/constant';
import { ChatService } from '../../../services/chat.service';
import { TokenService } from '../../../services/token.service';
import { AuthService } from '../../../services/auth.service';
import { concatMap, forkJoin, map } from 'rxjs';
import { Chat } from '../../../model/chat.model';
import { SocketService } from '../../../services/socket.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ContactItemComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent implements OnInit, AfterViewInit {
  contacts: any;

  constructor(
    private userService: UserService,
    private chatService: ChatService,
    private tokenService: TokenService,
    private authService: AuthService,
    private socketService: SocketService
  ) {}

  ngOnInit(): void {
    this.getContacts();
    this.onMessage();
  }

  ngAfterViewInit(): void {}

  onSocket(): void {
    this.onMessage();
  }

  onMessage(): void {
    this.socketService.onEvent('contact').subscribe({
      next: (value: any) => {
        this.getContacts();
      },
    });
  }

  getContacts(): void {
    const token = this.tokenService.getToken();

    this.authService
      .verifyToken(token)
      .pipe(
        concatMap((user: User) => {
          return this.chatService.findContact(user._id || '').pipe(
            concatMap((sender: string[]) => {
              return forkJoin(
                sender.map((item: string) =>
                  this.userService.findOne(item).pipe(
                    map((u: User) => {
                      return {
                        ...u,
                        avatar: `${API_URL.IMAGES}/${u.avatar}`,
                      };
                    })
                  )
                )
              ).pipe(
                concatMap((users: User[]) => {
                  return forkJoin(
                    users.map((item: User) =>
                      this.chatService.findPrivateMessage(
                        `sender=${user._id}&recipient=${item._id}`
                      )
                    )
                  ).pipe(
                    map((chats: Chat[][]) => {
                      return chats.map((item: Chat[], index: number) => {
                        return {
                          ...users[index],
                          message: item
                            .sort(
                              (a: any, b: any) =>
                                new Date(a.createAt).getTime() -
                                new Date(b.createAt).getTime()
                            )
                            .slice(-1)[0],
                          seen: item
                            .filter((c: Chat) => c.sender !== user._id)
                            .filter(
                              (c: Chat) => !c.seen?.includes(user._id || '')
                            ).length,
                        };
                      });
                    })
                  );
                })
              );
            })
          );
        })
      )
      .subscribe({
        next: (value: any) => {
          this.contacts = value;
        },
      });
  }
}
