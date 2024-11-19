import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { JwtAuthService } from './jwt-auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtAuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.jwtService.isTokenValid()) {
      // Allow navigation if token is valid
      return true;
    } else {
      // Redirect to login if token is invalid or missing
      this.router.navigate(['/signin']);
      return false;
    }
  }
}
