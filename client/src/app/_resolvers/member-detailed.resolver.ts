import { MembersService } from 'src/app/_services/members.service';
import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { Member } from '../_models/member';

@Injectable({
  providedIn: 'root'
})

export class MemberDetailedResolver implements Resolve<Member> {

  constructor(private membersService: MembersService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Member> {
    return this.membersService.getMember(route.paramMap.get('username') || '');
  }
}
