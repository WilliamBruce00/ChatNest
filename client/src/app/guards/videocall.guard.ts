import { inject } from '@angular/core';
import { ActivatedRoute, CanActivateFn } from '@angular/router';

export const videocallGuard: CanActivateFn = (route, state) => {
  console.log(route.queryParamMap);

  return true;
};
