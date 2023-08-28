import { Injectable } from '@angular/core';
import jwtDecode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  

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
}
