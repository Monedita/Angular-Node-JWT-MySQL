import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SubscriptionLike } from "rxjs";

import { ApiService, AuthService } from '../../services/';

import { PostModel, CommentModel } from '../../models';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit, OnDestroy {

  subscriptions$: SubscriptionLike[] = [];
  postId: any = 0;
  post: PostModel = {id:0, img_url:'', description:'', user_id:0, user_name:'',};
  comments: CommentModel[] = [];
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

  retrivingData(){
    this.subscriptions$.push(this.apiService.getRequest(`/routes/post/${this.postId}`)
    .subscribe( (resp) => {
      this.post = resp[0];
      this.comments = resp[1];
      this.show = true;
    }) );
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

  ngOnDestroy(): void {
    this.subscriptions$.forEach(subscription => subscription.unsubscribe())
  }

}
