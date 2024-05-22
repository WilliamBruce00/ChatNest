import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OtpService } from '../../services/otp.service';
import { OTP } from '../../model/otp.model';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import Swal, {
  SweetAlertArrayOptions,
  SweetAlertCustomClass,
  SweetAlertPosition,
  SweetAlertShowClass,
} from 'sweetalert2';
import { concatMap, interval, Observable, Subscription } from 'rxjs';
import { EmailService } from '../../services/email.service';
import { UserService } from '../../services/user.service';
import { User } from '../../model/user.model';

@Component({
  selector: 'app-otp',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './otp.component.html',
  styleUrl: './otp.component.scss',
})
export class OtpComponent implements OnInit {
  otp!: OTP;
  form = new FormGroup({
    one: new FormControl('', [Validators.required]),
    two: new FormControl('', [Validators.required]),
    three: new FormControl('', [Validators.required]),
    four: new FormControl('', [Validators.required]),
  });
  exp: number = 0;
  private countdownSubscription!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private otpService: OtpService,
    private emailService: EmailService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getOtp();
  }

  getOtp(): void {
    const id = this.route.snapshot.params['id'];

    this.otpService.findOne(id).subscribe({
      next: (data: OTP) => {
        this.otp = data;

        const exp = new Date(this.otp.exp ?? '');
        const current = new Date();

        this.exp = Math.floor((exp.getTime() - current.getTime()) / 1000);
        this.CountDown();
      },
      error: (err: any) => {
        throw err;
      },
    });
  }

  onSubmit(): void {
    const exp = new Date(this.otp.exp ?? '');
    const current = new Date();

    if (current > exp) {
      const id = this.route.snapshot.params['id'];

      Swal.fire({
        text: 'OTP đã hết hiệu lực',
        icon: 'warning',
        allowOutsideClick: false,
        confirmButtonText: 'Tạo lại',
        showCancelButton: true,
        cancelButtonAriaLabel: 'Hủy',
      }).then(({ isConfirmed }) => {
        if (isConfirmed) {
          Swal.fire({
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
            },
          });
          const data = {
            code: Math.floor(1000 + Math.random() * 9000).toString(),
          };

          this.otpService
            .update(id, data)
            .pipe(
              concatMap((otpResponse: OTP) => {
                const data = {
                  to: otpResponse.email ?? '',
                  body: `
                    <h2>Xin chào, cảm ơn bạn đã đăng ký tài khoản</h2>
                    <p>Đây là mã xác thực của bạn:</p>
                    <p>${otpResponse.code}</p>
                    <p>Mã xác thực này có hiệu lực trong vòng 120s</p>
                  `,
                  subject: 'Xác thực email',
                };
                return this.emailService.sendMail(data);
              })
            )
            .subscribe({
              next: (response: OTP) => {
                location.reload();
              },
              error: (err: any) => {
                throw err;
              },
            });
        }
      });
    } else {
      const { one, two, three, four } = this.form.controls;
      const code = `${one.value}${two.value}${three.value}${four.value}`;

      if (code !== this.otp.code) {
        Swal.fire({
          text: 'OTP không chính xác',
          allowOutsideClick: false,
          icon: 'error',
        });
      } else {
        Swal.fire({
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        const id = this.route.snapshot.params['id'];
        this.otpService.delete(id).subscribe();

        const data = JSON.parse(this.otp.data ?? '');

        this.userService.create(data).subscribe({
          next: (response: User) => {
            Swal.fire({
              title: 'Thành công',
              text: 'Tạo tài khoản thành công',
              allowOutsideClick: false,
              icon: 'success',
            }).then(({ isConfirmed }) => {
              if (isConfirmed) {
                location.href = 'login';
              }
            });
          },
          error: (err: any) => {
            throw err;
          },
        });
      }
    }
  }

  CountDown(): void {
    this.countdownSubscription = interval(1000).subscribe({
      next: () => {
        this.exp--;

        if (this.exp === 0) {
          this.countdownSubscription.unsubscribe();
        }
      },
    });
  }

  resetOTP(): void {
    Swal.fire({
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const data = {
      code: Math.floor(1000 + Math.random() * 9000).toString(),
    };

    const id = this.route.snapshot.params['id'];

    this.otpService
      .update(id, data)
      .pipe(
        concatMap((otpResponse: OTP) => {
          const data = {
            to: otpResponse.email ?? '',
            body: `
            <h2>Xin chào, cảm ơn bạn đã đăng ký tài khoản</h2>
            <p>Đây là mã xác thực của bạn:</p>
            <p>${otpResponse.code}</p>
            <p>Mã xác thực này có hiệu lực trong vòng 120s</p>
          `,
            subject: 'Xác thực email',
          };
          return this.emailService.sendMail(data);
        })
      )
      .subscribe({
        next: (response: any) => {
          location.reload();
        },
        error: (err: any) => {
          throw err;
        },
      });
  }
}
