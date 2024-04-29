import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Subject } from 'rxjs';
import { User } from '../../../models/user.model';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private menu: Subject<string> = new Subject()

  constructor(private service: JwtHelperService) { }

  isExist() {
    return this.getToken() != null && this.getToken() !== ''
  }

  isExpired() {
    return this.service.isTokenExpired(this.getToken())
  }

  logout() {
    if (this.getToken()) {
      localStorage.removeItem('jToken')
    }
  }

  getToken() {
    return (typeof (window) !== 'undefined') ? localStorage.getItem('jToken') : ''
  }

  getRole(): string {
    const decoded: any = this.getClaims()
    return decoded.Role
  }


  getClaims(): any {
    return (this.getToken()) ? jwtDecode(this.getToken()!) : ''
  }

  getUsername() {
    return (this.getToken()) ? this.getClaims().sub : ''
  }

  deleteToken() {
    if (typeof (window) !== 'undefined')
      localStorage.removeItem("jToken")
  }

  setToken(token: string) {
    if (typeof (window) !== 'undefined')
      localStorage.setItem('jToken', token)
  }

  subscribeRole() {
    return this.menu.asObservable()
  }

  nextRole() {
    this.menu.next((this.getToken()) ? this.getRole() : 'default')
  }

  getUser() {
    return { username: this.getClaims().sub, roles: [this.getRole()] }
  }
}
