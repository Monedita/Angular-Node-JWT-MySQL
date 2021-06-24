import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SubscriptionLike } from "rxjs";

import { ApiService, AuthService } from '../../services/';

import { PostModel } from '../../models';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {

  @ViewChild('fileInput', { static: false }) fileInput?: ElementRef;

  subscriptions$: SubscriptionLike[] = [];
  posts: PostModel[] = [];
  userName: string = String(localStorage.getItem("user_name"));

  uploadForm = new FormGroup({
    imageInput: new FormControl('',[
      Validators.required,
    ]), 
    descriptionInput: new FormControl('',[
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
    this.retrivingData();
  }

  retrivingData(){
    this.subscriptions$.push(this.apiService.getRequest(`/routes/user/${this.userName}`).subscribe((posts: PostModel[]) => {
      this.posts = posts;
    }));
  }

  upload(){
    //cheking if the user is logedin
    if (this.authService.isLoggedOut()){
      this.router.navigateByUrl('/login');
    } else {
      //make a dataForm javascript object and make the post request to the server
      const imageProcessed = this.fileInput?.nativeElement.files[0];
      const descriptionPure = this.uploadForm.controls['descriptionInput'].value;
      const javaForm = new FormData();
      javaForm.set('image', imageProcessed);
      javaForm.set('description', descriptionPure);
      //post request
      this.subscriptions$.push(this.apiService.postRequest(`/routes/post/create`, javaForm)
      .subscribe( () => {
        //no errors erase the form and update the posts array
        this.uploadForm.patchValue({ imageInput: '', descriptionInput: '', });
        this.retrivingData();
      }));
    }
  }

  onDeleted(postId: number) {
    this.subscriptions$.push(this.apiService.deleteRequest(`/routes/post/${postId}/delete`, {'postId': postId})
    .subscribe( () => {
        this.retrivingData();
      }));
  }


  ngOnDestroy(): void {
    this.subscriptions$.forEach(subscription => subscription.unsubscribe())
  }

}
