import { Injectable } from '@angular/core';
import { log } from 'console';
import { jwtDecode } from 'jwt-decode';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private menu: Subject<string> = new Subject()

  constructor() { }

  isExist() {
    return this.getToken() != null
  }

  logout() {
    if (this.getToken()) {
      localStorage.removeItem('jToken')
    }
  }

  getToken() {
    return (typeof (window) !== 'undefined') ? localStorage.getItem('jToken') : ''
  }

  getRole() {
    const decoded: any = this.getClaims()
    return decoded.Role
  }


  getClaims(): any {
    return (this.getToken()) ? jwtDecode(this.getToken()!) : null
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
}
