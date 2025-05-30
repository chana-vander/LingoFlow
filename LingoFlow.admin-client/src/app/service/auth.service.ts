// services/auth.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoginRequest, AuthResponse } from '../models/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:5092/api';
  private tokenSubject = new BehaviorSubject<string | null>(null);
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);

  token$ = this.tokenSubject.asObservable();
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/login`, credentials)
      .pipe(
        tap(response => {
          this.tokenSubject.next(response.token);
          this.isLoggedInSubject.next(true);
          localStorage.setItem('token', response.token);
        })
      );
  }

  logout(): void {
    this.tokenSubject.next(null);
    this.isLoggedInSubject.next(false);
    localStorage.removeItem('token');
  }

  getToken(): string | null {
    return this.tokenSubject.value || localStorage.getItem('token');
  }

  checkAuthStatus(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.tokenSubject.next(token);
      this.isLoggedInSubject.next(true);
    }
  }
}