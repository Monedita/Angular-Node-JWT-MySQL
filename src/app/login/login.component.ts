import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  error: boolean = false;

  loginForm = new FormGroup({
    email: new FormControl('',[
      Validators.required,
      Validators.email,
    ]), 
    password: new FormControl('',[
      Validators.required,
      Validators.minLength(8),
    ]),
  });

  constructor(
    private authService: AuthService, 
    private router: Router,
    )  { }

  login() {
    const val = this.loginForm.value;
    if (val.email && val.password) {
      this.authService.login(val.email, val.password).subscribe(
        () => {
          this.router.navigateByUrl('/');
        },
        () =>{
          this.error = true;
        }
      );
    }
  }

}
