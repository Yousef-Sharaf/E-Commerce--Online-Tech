import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Role } from '../models/user.model';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const expectedRole = route.data['role'] as Role;

  if (authService.isAuthenticated() && authService.hasRole(expectedRole)) {
    return true;
  }

  if (!authService.isAuthenticated()) {
      return router.parseUrl('/login');
  }

  // Redirect to unauthorized page or home
  return router.parseUrl('/unauthorized');
};
