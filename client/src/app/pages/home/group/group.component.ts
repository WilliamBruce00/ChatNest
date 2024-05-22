import { Component, OnInit } from '@angular/core';
import { CreateGroupComponent } from '../../../components/create-group/create-group.component';
import { TokenService } from '../../../services/token.service';
import { AuthService } from '../../../services/auth.service';
import { GroupService } from '../../../services/group.service';
import { User } from '../../../model/user.model';
import { Group } from '../../../model/group.model';
import { concatMap, forkJoin, map, retry } from 'rxjs';
import { ChatService } from '../../../services/chat.service';
import { Chat } from '../../../model/chat.model';
import { MemberService } from '../../../services/member.service';
import { Member } from '../../../model/member.model';
import { API_URL } from '../../../constant/constant';

@Component({
  selector: 'app-group',
  standalone: true,
  imports: [CreateGroupComponent],
  templateUrl: './group.component.html',
  styleUrl: './group.component.scss',
})
export class GroupComponent implements OnInit {
  isOpenFormCreate: boolean = false;
  groups: Group[] = [];
  user!: User;

  constructor(
    private tokenService: TokenService,
    private authService: AuthService,
    private groupService: GroupService,
    private chatService: ChatService,
    private memberService: MemberService
  ) {}

  ngOnInit(): void {
    this.getGroup();
  }

  getUser(): void {
    const token = this.tokenService.getToken();

    this.authService.verifyToken(token).subscribe({
      next: (value: User) => {
        this.user = value;
      },
    });
  }

  getGroup(): void {
    const token = this.tokenService.getToken();

    this.authService
      .verifyToken(token)
      .pipe(
        concatMap((user: User) => {
          return this.memberService.findbyUserID(user._id || '');
        }),
        concatMap((member: Member[]) => {
          return forkJoin(
            member.map((item: Member) =>
              this.groupService.findOne(item.groupID || '').pipe(
                map((group: Group) => {
                  return {
                    ...group,
                    img: `${API_URL.IMAGES}/${group.img}`,
                  };
                })
              )
            )
          );
        })
      )
      .subscribe({
        next: (value: any) => {
          this.groups = value;
        },
      });
  }

  openFormCreate(): void {
    this.isOpenFormCreate = !this.isOpenFormCreate;
  }

  eventClose(event: any): void {
    this.isOpenFormCreate = event;
    this.getGroup();
  }
}
