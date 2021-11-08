import { ToastrService } from 'ngx-toastr';
import { AccountService } from './../../_services/account.service';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { Member } from 'src/app/_models/member';
import { User } from 'src/app/_models/user';
import { MembersService } from 'src/app/_services/members.service';
import { take } from 'rxjs/operators';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {

  member: Member | undefined;
  user: User | undefined;

  @ViewChild('editForm')
  editForm!: NgForm;
  @HostListener('window:beforeunload',['$event']) unloadNotification($event: any){
    if (this.editForm.dirty){
      $event.returnValue = true;
    }
  }

  constructor(private accountService: AccountService, 
    private memberService: MembersService, 
    private toaster: ToastrService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.user = user);
  }

  ngOnInit(): void {
    this.getMemberProfile();
  }

  getMemberProfile(){
    if (this.user){
      this.memberService.getMember(this.user?.username).subscribe(member => this.member = member);
    }
  }

  updateMember(){
    if (this.member){
      this.memberService.updateMember(this.member).subscribe(()=> {
        this.toaster.success('Profile updated successfully');
        this.editForm.reset(this.member);
      });
    }
  }

}
