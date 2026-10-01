import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Check if the user is logged in
  if (authService.isloggedIn) {
    // Check the route's path via route.routeConfig
    const routePath = route.routeConfig?.path;

    // If the user is logged in, check if they are trying to access the login or add-user page
    if (routePath === 'login' || routePath === 'register') {
      // Redirect logged-in users to their dashboard based on role
      if (authService.isAdmin()) {
        router.navigate(['/admin-dashboard']);
      } else if (authService.isUser()) {
        router.navigate(['/user-dashboard']);
      }
      return false; // Prevent navigation to login or add-user page
    }
    return true; // Allow access to other routes
  } else {
    // If not logged in, allow access to login and add-user pages
    const routePath = route.routeConfig?.path;
    if (routePath === 'login' || routePath === 'register') {
      return true;
    }
    // Redirect to login page for any other routes
    router.navigate(['/login']);
    return false;
  }
};