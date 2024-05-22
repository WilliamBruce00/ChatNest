import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { OtpService } from '../services/otp.service';
import { OTP } from '../model/otp.model';

export const otpGuard: CanActivateFn = (route, state) => {
  const otpService = inject(OtpService);
  const router = inject(Router);

  const id = route.params?.['id'];

  otpService.findOne(id).subscribe({
    next: (data: OTP) => {
      const exp = new Date(data.exp || '');
      const current = new Date();

      if (current > exp) {
        otpService.delete(id).subscribe();
        router.navigateByUrl('/not-found');
      }
    },
    error: (err: any) => {
      router.navigateByUrl('/not-found');
    },
  });

  return true;
};
