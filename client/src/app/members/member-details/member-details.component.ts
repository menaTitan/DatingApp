import { PathLocationStrategy } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs/operators';
import { Member } from 'src/app/_models/member';
import { Message } from 'src/app/_models/message';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';
import { MessageService } from 'src/app/_services/message.service';
import { PresenceService } from 'src/app/_services/presence.service';

@Component({
  selector: 'app-member-details',
  templateUrl: './member-details.component.html',
  styleUrls: ['./member-details.component.css']
})
export class MemberDetailsComponent implements OnInit, OnDestroy {
  @ViewChild('memberTabs', {static: true}) memberTabs: TabsetComponent;
  activeTab: TabDirective;
  member: Member;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  messages : Message[] = [];
  user : User;

  constructor(private memberService : MembersService, private route: ActivatedRoute, 
    private toastr : ToastrService, private messageService: MessageService, 
    public presence : PresenceService, private accountService : AccountService) { 
      this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
        this.user = user;
      })
    }
 
  ngOnInit(): void {

    //calling the resolver to load the data be for the html template loads 
    this.route.data.subscribe(data => {
      this.member = data.member;
    })
    this.route.queryParams.subscribe(params =>{
      //console.log("this is the value of the tab: ",params.tab);
      params.tab ? this.selectTab(params.tab): this.selectTab(0);
    })
    this.galleryOptions = [
      {
        width: '500px',
        height: '500px',
        imagePercent:100,
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: false
      },
     ];
     this.galleryImages = this.getImages(); 
  }


  getImages(): NgxGalleryImage[]{
    const imagesUrls= [];
    for(const photo of this.member.photos){
      imagesUrls.push({
        small: photo?.url,
        medium: photo?.url,
        big: photo?.url
      })
    } 
    return imagesUrls;
  }
  
addLike(member: Member){
    this.memberService.addLike(member.username).subscribe(() =>{
      this.toastr.success(`You have liked ${member.knownAs}`);
    });
}


loadMessages(){
  this.messageService.getMessageThread(this.member.username).subscribe(messages => {
    this.messages = messages;
  })
}
onTabActivated(data: TabDirective){
    this.activeTab = data;
    if(this.activeTab.heading === 'Messages' && this.messages.length === 0){
        this.messageService.createHubConnection(this.user, this.member.username);
    }else{
      this.messageService.stopHubConnection();
    }
}

selectTab(tabId: number){
  this.memberTabs.tabs[tabId].active = true;
}

ngOnDestroy(): void {
  this.messageService.stopHubConnection();
}


}
