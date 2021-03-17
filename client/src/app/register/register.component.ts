import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../_services/account.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
 
  //@Input() usersFromHomeComponent: any; // getting data from the parent component
  @Output() cancelRegister = new EventEmitter() //passing data to child to the parent component
  model : any ={};
  constructor(private accountService: AccountService, private toastr: ToastrService) { }
  ngOnInit(): void {
  }

  register(){
      this.accountService.register(this.model).subscribe(response =>{
          console.log(JSON.stringify(response));
          this.cancel();
      }, error =>{
          console.log(error);
          this.toastr.error(error.error);
      });
      console.log(this.model);

  }

  cancel(){
    this.cancelRegister.emit(false);
  }

}
