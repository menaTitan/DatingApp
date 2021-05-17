import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { MemberEditComponent } from '../members/member-edit/member-edit.component';
import { ConfirmService } from '../_services/confirm.service';

@Injectable({
  providedIn: 'root'
})
export class PreventUnsavedChangesGuard implements CanDeactivate<unknown> {

  constructor(private confrimService: ConfirmService){}
  canDeactivate(component: MemberEditComponent) : Observable<boolean> | boolean {
    if(component.editForm.dirty){
      // this will give them an option to say yes or no, and if they click yes, then it will return true.
      return confirm('Are you sure you want to continue? Any unsaved changes will be lost');
       //return this.confrimService.confirm();
    }
    return true;
  }
  
}
