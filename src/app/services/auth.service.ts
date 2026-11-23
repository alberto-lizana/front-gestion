import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { JwtPayload } from '../interfaces/jwt-payload';
import { LoginRequest } from '../interfaces/login-request';
import { LoginResponse } from '../interfaces/login-response';

const TOKEN_KEY = 'token';

function decodeJwt(token: string | null): JwtPayload | null {
  if (!token) return null;
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join('')
    );
    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly _token = signal<string | null>(localStorage.getItem(TOKEN_KEY));

  readonly token = this._token.asReadonly();
  readonly username = computed(() => decodeJwt(this._token())?.sub ?? null);
  readonly roles = computed(() => decodeJwt(this._token())?.authorities ?? []);

  login(credenciales: LoginRequest) {
    return this.http
      .post<LoginResponse>(`${environment.apiUrl}/login`, credenciales)
      .pipe(
        tap((resp) => {
          localStorage.setItem(TOKEN_KEY, resp.token);
          this._token.set(resp.token);
        })
      );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    this._token.set(null);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    const payload = decodeJwt(this._token());
    return !!payload && payload.exp * 1000 > Date.now();
  }

  hasAnyRole(...roles: string[]): boolean {
    return roles.some((r) => this.roles().includes(r));
  }
}