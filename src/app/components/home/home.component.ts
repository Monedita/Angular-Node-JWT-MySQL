import { Component, OnInit, OnDestroy } from '@angular/core';
import { SubscriptionLike } from "rxjs";

import { ApiService } from '../../services/';

import { PostModel } from '../../models';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {

  subscriptions$: SubscriptionLike[] = [];
  posts: PostModel[] = [];


  constructor(
    private apiService: ApiService,
    ) { }

  ngOnInit(): void {
    this.subscriptions$.push(this.apiService.getRequest('/routes/posts')
    .subscribe((resp: PostModel[]) => {
      this.posts = resp;
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions$.forEach(subscription => subscription.unsubscribe());
  }

}
