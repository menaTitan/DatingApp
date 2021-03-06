import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {HttpClient} from '@angular/common/http';
import { User } from './_models/user';
import {AccountService} from './_services/account.service';
import { PresenceService } from './_services/presence.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'The Dating app';
  users : any; //data type can be anything.
  constructor(private http: HttpClient, private accountService: AccountService, private presence : PresenceService){}

  ngOnInit(){
   // this.getUsers();
    this.setCurrentUser();
  }

  setCurrentUser(){
    const user : User = JSON.parse(localStorage.getItem('user'));
    if(user){
      this.accountService.setCurrentUser(user);
      this.presence.createHubConnection(user);
    }
   
  }
  getUsers(){
    this.http.get(environment.apiUrl+'users').subscribe(reponse => {
      this.users = reponse;

    }, error=>{
      console.log(error);
    })
  }
}
