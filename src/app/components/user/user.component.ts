import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SubscriptionLike } from 'rxjs';

import { ApiService, AuthService } from '../../services/';

import { PostModel } from '../../models';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit, OnDestroy {

  subscriptions$: SubscriptionLike[] = [];
  posts: PostModel[] = [];
  userName: string = '';

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private router: Router,
    private activeRoute: ActivatedRoute
  ) {
      //cheking if the user is logedin
      if (authService.isLoggedOut()){
        this.router.navigateByUrl('/login');
      }
    }

  ngOnInit(): void {
    this.userName = String(this.activeRoute.snapshot.paramMap.get('userName'));
    this.retrivingData();
  }

  retrivingData(){
    this.subscriptions$.push(this.apiService.getRequest(`/routes/user/${this.userName}`)
    .subscribe((posts: PostModel[]) => {
      this.posts = posts;
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions$.forEach(subscription => subscription.unsubscribe())
  }

}
