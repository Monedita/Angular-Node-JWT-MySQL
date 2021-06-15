import { Component, OnInit } from '@angular/core';

import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {

  posts: any = [];

  constructor(
    private apiService: ApiService,
    ) { }

  ngOnInit(): void {
    this.apiService.getAllPosts().subscribe((posts: any) => {
      this.posts = posts;
    })
  }

}
