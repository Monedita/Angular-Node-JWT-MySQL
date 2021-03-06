import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router'; //for subscribing
import { SubscriptionLike } from "rxjs";

import { AuthService } from '../../services/';



@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {

  subscriptions$: SubscriptionLike[] = [];
  loggedIn: boolean = false;
  notLoggedIn: boolean = true;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) { }

  logOut(){
    console.log("boton funciona");
    this.authService.logout();
  }
  
  ngOnInit(): void {
    this.subscriptions$.push(this.router.events.subscribe((event: any) => {
      if (event.constructor.name === "NavigationEnd") {
      this.authService.isLoggedIn() ? this.loggedIn = true : this.loggedIn = false;
      this.notLoggedIn = !this.loggedIn;
      }
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions$.forEach(subscription => subscription.unsubscribe());
  }

}
