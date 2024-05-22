import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { User } from '../../model/user.model';
import { AuthService } from '../../services/auth.service';
import { TokenService } from '../../services/token.service';
import { GroupService } from '../../services/group.service';
import { Group } from '../../model/group.model';
import { ChatService } from '../../services/chat.service';
import { concatMap, forkJoin } from 'rxjs';
import { MemberService } from '../../services/member.service';

@Component({
  selector: 'app-create-group',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './create-group.component.html',
  styleUrl: './create-group.component.scss',
})
export class CreateGroupComponent implements OnInit {
  @Output() eventClose = new EventEmitter<any>();

  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
  });
  user!: User;

  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
    private groupService: GroupService,
    private chatService: ChatService,
    private memberService: MemberService
  ) {}

  ngOnInit(): void {
    this.getUser();
  }

  closeForm(): void {
    this.eventClose.emit(false);
  }

  getUser(): void {
    const token = this.tokenService.getToken();

    this.authService.verifyToken(token).subscribe({
      next: (user: User) => {
        this.user = user;
      },
    });
  }

  onSubmit(): void {
    const { name } = this.form.controls;

    this.groupService
      .create({
        name: name.value || '',
      })
      .pipe(
        concatMap((group: Group) => {
          return forkJoin([
            this.chatService.create({
              sender: this.user._id,
              recipient: group._id,
              message: this.user._id,
              type: 'create group',
            }),
            this.memberService.create({
              userID: this.user._id,
              groupID: group._id,
              role: 'leader',
            }),
          ]);
        })
      )
      .subscribe({
        next: (value: any) => {
          this.eventClose.emit(false);
        },
      });
  }
}
