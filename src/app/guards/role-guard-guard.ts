import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard = (...rolesPermitidos: string[]): CanActivateFn => () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.hasAnyRole(...rolesPermitidos) ? true : router.createUrlTree(['/inicio']);
};