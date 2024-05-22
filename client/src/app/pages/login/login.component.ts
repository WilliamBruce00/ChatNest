import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { TokenService } from '../../services/token.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  isShowPassword: boolean = false;
  form = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(
    private router: Router,
    private authService: AuthService,
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {}

  showPassword(): void {
    this.isShowPassword = !this.isShowPassword;
  }

  onSubmit(): void {
    Swal.fire({
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const { email, password } = this.form.controls;

    const data = {
      email: email.value ?? '',
      password: password.value ?? '',
    };

    this.authService.login(data).subscribe({
      next: ({ access_token }: { access_token: string }) => {
        this.tokenService.setToken(access_token);

        Swal.fire({
          title: 'Thành công',
          text: 'Đăng nhập thành công',
          icon: 'success',
          allowOutsideClick: false,
        }).then(({ isConfirmed }) => {
          if (isConfirmed) location.href = '/';
        });
      },
      error: (err: any) => {
        // if (err.status === 401) {
        Swal.fire({
          title: 'Thất bại',
          text: 'Email hoặc mật khẩu không chính xác',
          icon: 'error',
          allowOutsideClick: false,
        });
        // }
      },
    });
  }
}
