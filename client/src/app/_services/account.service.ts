import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import { User } from '../_models/user';
import { ReplaySubject } from 'rxjs';
import { environment } from 'src/environments/environment';
// services are singlton 
// injectable mean that this servie can be injected into other components or other services in our application
@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = environment.apiUrl;
  private currentUserSource  = new ReplaySubject<User>(1); // 1 indicate the size of the buffer. We only need one user
  currentUser$ = this.currentUserSource.asObservable();
  constructor(private http: HttpClient) { }

  login(model:any){
      return this.http.post(`${this.baseUrl}account/login`, model).pipe(
        map((response : User) =>{
            const user = response;
            if(user){
               localStorage.setItem('user', JSON.stringify(user));
               this.currentUserSource.next(user);
            }
            return user;
        })
      )
  }

  register(model: any){
      return this.http.post(this.baseUrl + 'account/register', model).pipe(
        map((user : User)=> {
            if(user){
               localStorage.setItem('user', JSON.stringify(user));
               this.currentUserSource.next(user);
            }
            return user;
        })
      )
  }

  setCurrentUser(user : User){
    this.currentUserSource.next(user);
  }

  logout(){
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
  }
}
