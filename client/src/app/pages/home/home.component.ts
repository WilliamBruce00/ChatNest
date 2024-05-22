import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { User } from '../../model/user.model';
import { SocketService } from '../../services/socket.service';
import { AuthService } from '../../services/auth.service';
import { TokenService } from '../../services/token.service';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import Swal from 'sweetalert2';
import { UserService } from '../../services/user.service';
import { OpenChatService } from '../../services/open-chat.service';
import { BoxMessageComponent } from '../../components/box-message/box-message.component';
import { UserOnlineService } from '../../services/user-online.service';
import { ProfileComponent } from '../../components/profile/profile.component';
import { OpenProfileService } from '../../services/open-profile.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
    FormsModule,
    ReactiveFormsModule,
    BoxMessageComponent,
    ProfileComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  isOpenChat: boolean = false;
  isOpenProfile: boolean = false;
  form = new FormGroup({
    keyword: new FormControl('', [Validators.required]),
  });

  constructor(
    private socketService: SocketService,
    private authService: AuthService,
    private tokenService: TokenService,
    private userService: UserService,
    private router: Router,
    private openChatService: OpenChatService,
    private userOnlineService: UserOnlineService,
    private openProfileService: OpenProfileService
  ) {}

  ngOnInit(): void {
    this.openChatService.getData().subscribe({
      next: (value: any) => {
        this.isOpenChat = value.open;
      },
    });

    this.openProfileService.getData().subscribe({
      next: (value: any) => {
        this.isOpenProfile = value.open;
      },
    });

    this.emitSocket();
    this.onSocket();
  }

  onSubmit(): void {
    const { keyword } = this.form.controls;

    if (!keyword.value) {
      return;
    }

    this.router.navigateByUrl(`/search/${keyword.value}`);
    this.form.reset();
  }

  emitSocket(): void {
    this.emitOnline();
  }

  emitOnline(): void {
    const token = this.tokenService.getToken();

    this.authService.verifyToken(token).subscribe({
      next: (value: User) => {
        this.socketService.emit('online', value._id);
      },
    });
  }

  onSocket(): void {
    this.onOnline();
  }

  onOnline(): void {
    this.socketService.onEvent('online').subscribe({
      next: (value: any) => {
        this.userOnlineService.setData(Object.values(value));
      },
    });
  }
}
