import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SubscriptionLike } from "rxjs";

import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit, OnDestroy {

  subscriptions$: SubscriptionLike[] = [];
  postId: any = '';
  post: any = {};
  show: boolean = false;

  commentForm = new FormGroup({
    comment: new FormControl('',[
      Validators.required,
    ]),
  });

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
    //geting the post id from the route
    this.postId = this.activeRoute.snapshot.paramMap.get('postId');
    //retriving the single post
    this.retrivingData();
  }

  postComment() {
    //geting the post id from the route
    this.postId = this.activeRoute.snapshot.paramMap.get('postId');
    //retriving values from the form
    const payload = this.commentForm.value;
    //I post the comment
      this.apiService.postRequest(`/routes/post/${this.postId}/postComment`, payload ).subscribe( () => {
        console.log("Post Record in the database");
        this.retrivingData();
        this.commentForm.patchValue({ comment: '', });
      });
  }

  retrivingData(){
    this.subscriptions$.push(this.apiService.getRequest(`/routes/post/${this.postId}`)
    .subscribe((post: any) => {
      this.post = post;
      this.show = true;
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions$.forEach(subscription => subscription.unsubscribe())
  }

}
