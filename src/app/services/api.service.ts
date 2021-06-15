import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})

export class ApiService {
  //service - private variable type of HttpClientModule
  constructor(private http: HttpClient) {}

  getAllPosts(){
    return this.http.get('/routes/posts');
  }
  
  getUserPosts(userName: any){
    return this.http.get(`/routes/user/${userName}`);
  }

  getRequest(url: string): Observable<any>{
    return this.http.get(url).pipe(
      catchError(this.handleError)
    )
  }
  
  postRequest(url: string, data: any, option?: any): Observable<any> {
    return this.http.post(url, data, option).pipe(
      catchError(this.handleError)
    )
  }

  updateRequest(url:string, data: any, option?: any): Observable<any> {
    return this.http.put(url, data, option).pipe(
      catchError(this.handleError)
    )
  }

  //function to cach errors
  handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // Return an observable with a user-facing error message.
    return throwError(
      'Something bad happened; please try again later.');
  }

}
