import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
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
  registerForm: FormGroup;
  maxDate: Date;
  constructor(private accountService: AccountService, private toastr: ToastrService, private fb: FormBuilder) { }
  ngOnInit(): void {
    this.intitializeForm();
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }

  intitializeForm(){
    this.registerForm = this.fb.group({
      gender:      ['male'],
      username:    ['', Validators.required],
      knownAs:     ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      city:        ['', Validators.required],
      country:     ['', Validators.required],
      password:    ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
      confirmPassword: ['', [Validators.required, this.matchValues('password')]]
    })

    this.registerForm.controls.password.valueChanges.subscribe(()=>{
      this.registerForm.controls.confirmPassword.updateValueAndValidity();
    })
  }

  // creating custom validator 
  matchValues(matchTo: string): ValidatorFn{
      return(control: AbstractControl) =>{
        //control?.value is the confirmPassword control 
        return control?.value === control?.parent?.controls[matchTo].value ? null : {isMatching: true}
      }
  }
  register(){
    console.log(this.registerForm.value);
    /*
      this.accountService.register(this.model).subscribe(response =>{
          console.log(JSON.stringify(response));
          this.cancel();
      }, error =>{
          console.log(error);
          this.toastr.error(error.error);
      });
      console.log(this.model);
      */
  }

  cancel(){
    this.cancelRegister.emit(false);
  }

}
