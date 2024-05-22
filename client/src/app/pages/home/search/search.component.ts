import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { ActivatedRoute, Params } from '@angular/router';
import { concatMap, map } from 'rxjs';
import { User } from '../../../model/user.model';
import { TokenService } from '../../../services/token.service';
import { AuthService } from '../../../services/auth.service';
import { API_URL } from '../../../constant/constant';
import { OpenChatService } from '../../../services/open-chat.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent implements OnInit {
  result!: User[];

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private tokenService: TokenService,
    private authService: AuthService,
    private openChatService: OpenChatService
  ) {}

  ngOnInit(): void {
    this.getSearch();
  }

  getSearch(): void {
    const token = this.tokenService.getToken();

    this.route.params
      .pipe(
        concatMap((params: Params) => {
          return this.userService.searchkeyword(params['keyword']);
        }),
        concatMap((user: User[]) => {
          return this.authService.verifyToken(token).pipe(
            map((data: User) => {
              return user.filter((item: User) => item._id !== data._id);
            })
          );
        })
      )
      .subscribe({
        next: (value: any) => {
          this.result = value.map((item: User) => {
            return {
              ...item,
              avatar: `${API_URL.IMAGES}/${item.avatar}`,
            };
          });
        },
      });
  }

  openChat(data: User): void {
    this.openChatService.setData({
      open: true,
      type: 'private',
      data,
    });
  }
}
