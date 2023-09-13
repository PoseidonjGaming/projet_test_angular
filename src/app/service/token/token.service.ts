import { Injectable } from '@angular/core';
import jwtDecode from 'jwt-decode';
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
    return localStorage.getItem('jToken')
  }

  getRole() {
    const decoded: any = this.getClaims()
    return decoded.Role
  }


  getClaims(): any {
    return jwtDecode(this.getToken()!)
  }

  deleteToken() {
    localStorage.removeItem("jToken")
  }

  setToken(token: string) {
    localStorage.setItem('jToken', token)
  }

  subscribeRole() {
    return this.menu.asObservable()
  }

  nextRole() {
    this.menu.next((this.getToken()) ? this.getRole() : 'default')
  }
}
