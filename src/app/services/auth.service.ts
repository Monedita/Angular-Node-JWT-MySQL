import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from "moment";
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})

export class AuthService {
      
  constructor(private http: HttpClient) { }

  register( payload: any ) {
    return this.http.post('/auth/register', payload )
        .pipe(
          map((res: any) => this.setSession(res)) 
        );
  }

  login(email:string, password:string ) {
    return this.http.post('/auth/login', {email, password})
        .pipe(
          map((res: any) => this.setSession(res)) 
        );
  }

  
  private setSession(authResult: any) {
    const expiresAt = moment().add(authResult.payload.expiresIn,'second');
    localStorage.setItem('id_token', authResult.token);
    localStorage.setItem('user_name', authResult.payload.user_name);
    localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()) );
  }          


  logout() {
      localStorage.removeItem("id_token");
      localStorage.removeItem("user_name");
      localStorage.removeItem("expires_at");
  }


  public isLoggedIn() {
      return moment().isBefore(this.getExpiration());
  }


  isLoggedOut() {
      return !this.isLoggedIn();
  }


  getExpiration() {
      const expiration: any = localStorage.getItem("expires_at");
      const expiresAt = JSON.parse(expiration);
      return moment(expiresAt);
  }    

  
}