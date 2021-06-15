import { Component, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { SubscriptionLike } from "rxjs";

import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnDestroy {

  subscriptions$: SubscriptionLike[] = [];

  registerForm = new FormGroup({
    email: new FormControl('',[
      Validators.required,
      Validators.email,
    ]), 
    real_name: new FormControl('',[
      Validators.required,
    ]), 
    user_name: new FormControl('',[
      Validators.required,
      Validators.minLength(6),
    ]), 
    password: new FormControl('',[
      Validators.required,
      Validators.minLength(8),
    ]),
  });

  constructor(
    private authService: AuthService,
    private router: Router,
    ){}

  register() {
    const payload = this.registerForm.value;
    this.subscriptions$.push(this.authService.register(payload)
    .subscribe( () => {
        console.log("User is registred");
        this.router.navigateByUrl('/');
      }));
  }

  ngOnDestroy(): void {
    this.subscriptions$.forEach(subscription => subscription.unsubscribe())
  }

}