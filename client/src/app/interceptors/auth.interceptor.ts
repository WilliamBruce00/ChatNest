import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '../services/token.service';
import { catchError, concatMap } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);

  const token = tokenService.getToken();

  const modifiedReq = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${token}`),
  });

  const exclude = ['/auth/login'];

  if (!exclude.some((e) => req.url.includes(e))) {
    return next(modifiedReq).pipe(
      catchError((error: any) => {
        location.href = 'login';
        return [];
      })
    );
  }

  return next(req);
};
