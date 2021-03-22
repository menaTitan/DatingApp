import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs/operators';
import { Member } from 'src/app/_models/member';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {
  @ViewChild('editForm') editForm: NgForm; // access the value for html element
  member : Member;
  user : User;
  // allow us to access the browser window 
  @HostListener ('window:beforeunload', ['$event']) unloadNotification($event: any){
      if(this.editForm.dirty){
        $event.returnValue = true;
      }
  }  
  constructor(private accountService : AccountService, private memberService: MembersService, private toastr: ToastrService) { 
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {this.user = user});
  }

  ngOnInit(): void {
    this.loadMember();
  }

  loadMember(){
    this.memberService.getMember(this.user.username).subscribe(member => {
       this.member = member;
       console.log(this.member);
    })
  }

  updateMember(){
    this.memberService.updateMember(this.member).subscribe(() =>{
      console.log(this.member);
      this.toastr.success('Profile has been updated successfully');
      //reset the form state 
      this.editForm.reset(this.member);
    })

  }
}
