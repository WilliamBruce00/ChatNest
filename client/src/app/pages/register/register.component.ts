import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { OtpService } from '../../services/otp.service';
import { catchError, concatMap, map, of, throwError } from 'rxjs';
import { OTP } from '../../model/otp.model';
import { EmailService } from '../../services/email.service';
import { Email } from '../../model/email.model';
import Swal from 'sweetalert2';
import { User } from '../../model/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, FormsModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {
  isShowPassword: boolean = false;
  form = new FormGroup({
    fullname: new FormControl('', [Validators.required]),
    email: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
    birthday: new FormControl('', [
      Validators.required,
      Validators.pattern(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/),
    ]),
    gender: new FormControl('', [Validators.required]),
  });

  constructor(
    private userService: UserService,
    private otpService: OtpService,
    private emailService: EmailService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  showPassword(): void {
    this.isShowPassword = !this.isShowPassword;
  }

  onBrithday(e: HTMLInputElement): void {}

  onSubmit(): void {
    Swal.fire({
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const { email, fullname, password, birthday, gender } = this.form.controls;
    const data = {
      email: email.value || '',
      data: JSON.stringify({
        email: email.value,
        fullname: fullname.value,
        password: password.value,
        gender: typeof gender.value === 'string' && +gender.value,
        birthday: birthday.value,
        avatar:
          typeof gender.value === 'string' && +gender.value === 0
            ? 'avatar-default-male.png'
            : 'avatar-default-female.png',
      }),
      code: Math.floor(1000 + Math.random() * 9000).toString(),
    };

    this.userService
      .findAll()
      .pipe(
        concatMap((userResponse: User[]) => {
          const check = userResponse.find(
            (user: User) => user.email === email.value
          );

          if (check) {
            return throwError('Email đã tồn tại trong hệ thống');
          }

          return this.otpService.create(data);
        }),
        concatMap((otpResponse: OTP) => {
          const data = {
            to: otpResponse.email || '',
            body: `
              <h2>Xin chào, cảm ơn bạn đã đăng ký tài khoản</h2>
              <p>Đây là mã xác thực của bạn:</p>
              <p>${otpResponse.code}</p>
              <p>Mã xác thực này có hiệu lực trong vòng 120s</p>
            `,
            subject: 'Xác thực email',
          };
          return this.emailService.sendMail(data).pipe(map(() => otpResponse));
        })
      )
      .subscribe({
        next: (response: OTP) => {
          this.router.navigateByUrl(`/otp/${response._id}`);
          Swal.close();
        },
        error: (err: any) => {
          Swal.fire({
            text: err,
            icon: 'error',
            allowOutsideClick: false,
          });
        },
      });
  }
}
