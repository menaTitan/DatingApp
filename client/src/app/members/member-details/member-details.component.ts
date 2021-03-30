import { PathLocationStrategy } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { ToastrService } from 'ngx-toastr';
import { Member } from 'src/app/_models/member';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-details',
  templateUrl: './member-details.component.html',
  styleUrls: ['./member-details.component.css']
})
export class MemberDetailsComponent implements OnInit {

  member: Member;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  constructor(private memberService : MembersService, private route: ActivatedRoute, private toastr : ToastrService) { }


  ngOnInit(): void {
    this.loadMember();
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
  loadMember(){
    this.memberService.getMember(this.route.snapshot.paramMap.get('username')).subscribe(member =>{
      this.member = member;
      this.galleryImages = this.getImages(); 
    });
  }

  addLike(member: Member){
    this.memberService.addLike(member.username).subscribe(() =>{
      this.toastr.success(`You have liked ${member.knownAs}`);
    });
}

}
