import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router'; //for roting
import { HttpClientModule } from '@angular/common/http'; //for http request
import { ReactiveFormsModule } from '@angular/forms'; //for reactive forms
import { HTTP_INTERCEPTORS } from '@angular/common/http';//for the http auth interceptor 

import { AppComponent } from './app.component';

import { NavbarComponent } from './navbar/navbar.component';
import { ContactComponent } from './contact/contact.component';
import { HomeComponent } from './home/home.component';
import { CardImgComponent } from './card-img/card-img.component';
import { UserComponent } from './user/user.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { PostComponent } from './post/post.component';
import { ProfileComponent } from './profile/profile.component';

import { ApiService } from './services/api.service';
import { AuthService } from './services/auth.service';

import { AuthInterceptor } from './auth.interceptor';

//I create the frontend rutes, an array of objects.
const arrayRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'user/:userName', component: UserComponent },
  { path: 'post/:postId', component: PostComponent },
  { path: 'profile', component: ProfileComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ContactComponent,
    HomeComponent,
    CardImgComponent,
    UserComponent,
    LoginComponent,
    RegisterComponent,
    PostComponent,
    ProfileComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    //I pass the routes to the Routing Module
    RouterModule.forRoot(arrayRoutes),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    ApiService,
    AuthService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
