import { Component, OnInit } from '@angular/core';
import { TokenService } from '../../../../services/token.service';
import { AuthService } from '../../../../services/auth.service';
import { FriendService } from '../../../../services/friend.service';
import { Friend } from '../../../../model/friend.model';
import { concatMap, find, forkJoin, map, of } from 'rxjs';
import { User } from '../../../../model/user.model';
import { AddFriend } from '../../../../model/addfriend.model';
import { UserService } from '../../../../services/user.service';
import { API_URL } from '../../../../constant/constant';
import { OpenProfileService } from '../../../../services/open-profile.service';
import { OpenChatService } from '../../../../services/open-chat.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export class ListComponent implements OnInit {
  friends: any[] = [];

  constructor(
    private tokenService: TokenService,
    private authService: AuthService,
    private friendService: FriendService,
    private userService: UserService,
    private openProfileService: OpenProfileService,
    private openChatService: OpenChatService
  ) {}

  ngOnInit(): void {
    this.getFriend();
  }

  getFriend(): void {
    const token = this.tokenService.getToken();

    this.authService
      .verifyToken(token)
      .pipe(
        concatMap((user: User) => {
          return this.friendService.findbyUserID(user._id || '');
        }),
        concatMap((friends: Friend[]) => {
          return forkJoin(
            friends.map((item: Friend) =>
              this.userService.findOne(item.friendID || '').pipe(
                map((user: User) => {
                  return {
                    ...item,
                    friendID: {
                      ...user,
                      avatar: `${API_URL.IMAGES}/${user.avatar}`,
                    },
                  };
                })
              )
            )
          );
        })
      )
      .subscribe({
        next: (value: any) => {
          this.friends = value;
        },
      });
  }

  handleOpenProfile(user: User): void {
    this.openProfileService.setData({ open: true, user });
  }

  handleOpenChat(user: User): void {
    this.openChatService.setData({ open: true, data: user });
  }

  handleCancelFriend(friendID: string): void {
    const token = this.tokenService.getToken();

    Swal.fire({
      text: 'Bạn có chắc chắc muốn hủy kết bạn không?',
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
              return forkJoin([
                this.friendService.findbyUserID(user._id || '').pipe(
                  concatMap((friends: Friend[]) => {
                    const find = friends.find(
                      (friend: Friend) => friend.friendID === friendID
                    );
                    return this.friendService.delete(find?._id || '');
                  })
                ),
                this.friendService.findbyUserID(friendID).pipe(
                  concatMap((friends: Friend[]) => {
                    const find = friends.find(
                      (friend: Friend) => friend.friendID === user._id
                    );
                    return this.friendService.delete(find?._id || '');
                  })
                ),
              ]);
            })
          )
          .subscribe({
            next: (value: any) => {
              console.log(value);
            },
          });
      } else {
        console.log('Cancel');
      }
    });
  }
}
