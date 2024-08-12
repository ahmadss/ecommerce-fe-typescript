import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  private readonly USER_ID_KEY = 'userId';
  private readonly USER_NAME_KEY = 'userName';
  private readonly ROLE_KEY = 'roles'; // Changed to 'roles' to indicate multiple roles
  private readonly TOKEN_KEY = 'token';

  private usernameSubject = new BehaviorSubject<string | null>(this.getUserNameFromStorage());
  private rolesSubject = new BehaviorSubject<string[]>(this.getRolesFromStorage());

  constructor() { }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  // Set User ID
  setUserId(userId: string): void {
    this.isBrowser() ? localStorage.setItem(this.USER_ID_KEY, userId): null;
  }

  // Get User ID
  getUserId(): string | null {
    return localStorage.getItem(this.USER_ID_KEY);
  }

  setUserName(userName: string): void {
    if (userName) {
      this.isBrowser() ? localStorage.setItem(this.USER_NAME_KEY, userName): null;
    } else {
      this.isBrowser() ? localStorage.removeItem(this.USER_NAME_KEY): null;
    }
    this.usernameSubject.next(userName);
  }

  // Get User ID
  getUserName(): BehaviorSubject<string | null> {
    return this.usernameSubject;
  }

  getUserNameFromStorage(): string | null {
    return this.isBrowser() ? localStorage.getItem(this.USER_NAME_KEY): null;
  }

  // Set Roles (multiple roles)
  setRoles(roles: string[]): void {
    this.isBrowser() ? localStorage.setItem(this.ROLE_KEY, JSON.stringify(roles)): null;
    this.rolesSubject.next(roles);
  }

  // Get Roles (multiple roles)
  getRoles(): BehaviorSubject<string[]> {
    return this.rolesSubject;
  }

  private getRolesFromStorage(): string[] {
    if (this.isBrowser()) {
      const roles = localStorage.getItem(this.ROLE_KEY);
      return roles ? JSON.parse(roles) : [];
    }
    return [];
  }

  // Set Token
  setToken(token: string): void {
    this.isBrowser() ? localStorage.setItem(this.TOKEN_KEY, token): null;
  }

  // Get Token
  getToken(): string | null {
    return this.isBrowser() ? localStorage.getItem(this.TOKEN_KEY): null;
  }

  isLoggedIn(): boolean {
    return this.isBrowser() && !!localStorage.getItem(this.TOKEN_KEY);
  }

  // Check if User is Logged In and Not Admin
  canAccessProtectedRoutes(): boolean {
    const token = this.getToken();
    const roles = this.rolesSubject.getValue();
    return !!token && !roles.includes('ROLE_admin');
  }

  canAccessUserProtectedRoutes(): boolean {
    const token = this.getToken();
    const roles = this.rolesSubject.getValue();
    return !!token && roles.includes('ROLE_user');
  }

  // Remove All Data
  clear(): void {
    if (this.isBrowser()) {
    localStorage.removeItem(this.USER_ID_KEY);
    localStorage.removeItem(this.ROLE_KEY);
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_NAME_KEY);
    this.usernameSubject.next(null);
    this.rolesSubject.next([]);
    }
  }
}
