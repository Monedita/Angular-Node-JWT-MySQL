import { Component, OnInit, OnDestroy } from '@angular/core';
import { SubscriptionLike } from "rxjs";

import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {

  subscriptions$: SubscriptionLike[] = [];
  posts: any = [];

  constructor(
    private apiService: ApiService,
    ) { }

  ngOnInit(): void {
    this.subscriptions$.push(this.apiService.getAllPosts().subscribe((posts: any) => {
      this.posts = posts;
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions$.forEach(subscription => subscription.unsubscribe());
  }

}
