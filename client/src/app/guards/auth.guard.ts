import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../services/token.service';
import { AuthService } from '../services/auth.service';
import { catchError, of } from 'rxjs';
import { User } from '../model/user.model';

export const authGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService);
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = tokenService.getToken();

  authService.verifyToken(token).subscribe({
    next: (user: User) => {},
    error: (err: any) => {
      router.navigateByUrl('/login');
    },
  });

  return true;
};
