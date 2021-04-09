import { Injectable } from '@angular/core';
import {HttpClient, JsonpClientBackend} from '@angular/common/http';
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
               this.setCurrentUser(user);
            }
            return user;
        })
      )
  }

  register(model: any){
      return this.http.post(this.baseUrl + 'account/register', model).pipe(
        map((user : User)=> {
            if(user){
               this.setCurrentUser(user);
            }
            return user;
        })
      )
  }

  setCurrentUser(user : User){
    user.roles = [];
    const roles = this.getDecoderToken(user.token).role;
    Array.isArray(roles) ? user.roles = roles : user.roles.push(roles);
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSource.next(user);
  }

  logout(){
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
  }

  getDecoderToken(token: string){
    return JSON.parse(atob(token.split('.')[1]));
  }
}
