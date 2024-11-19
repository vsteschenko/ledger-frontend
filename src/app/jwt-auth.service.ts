import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import {jwtDecode} from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class JwtAuthService {
  constructor(private cookieService: CookieService) {}

  setToken(token: string): void {
    this.cookieService.set('token', token, {
      // secure: true,
      // sameSite: 'Strict',
    });
  }

  getToken(): string | null {
    return this.cookieService.get('token');
  }

  deleteToken(): void {
    this.cookieService.delete('token');
  }

  isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }

    try {
      const decoded: any = jwtDecode(token);
      const expiryDate = decoded.exp * 1000;
      return Date.now() < expiryDate;
    } catch (error) {
      return false;
    }
  }
}
