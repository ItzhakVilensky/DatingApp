import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { Member } from 'src/app/_models/member';
import { Pagination } from 'src/app/_models/paginaton';
import { User } from 'src/app/_models/user';
import { UserParams } from 'src/app/_models/userParams';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {

  members: Member[] = [];
  pagination: Pagination | undefined;
  userParams: UserParams | undefined;
  user: User | undefined;

  constructor(private membersService: MembersService, private accountService: AccountService) {
    this.accountService.currentUser$
      .pipe(
        take(1)
      ).subscribe((user) => {
        if (user) {
          console.log('😊 MEMBER-LIST user: ', user);
          this.userParams = new UserParams(user);
          this.user = user;
        }
      });
  }

  ngOnInit(): void {
    this.loadMembers();
  }

  loadMembers() {
    if (!this.userParams) return;
    this.membersService.getMembers(this.userParams).subscribe({
      next: response => {
        if (response.result && response.pagination) {
          this.members = response.result;
          this.pagination = response.pagination;
        }
      }
    });
  }

  pageChanged(event: any) {
    if (this.userParams && this.userParams?.pageNumber !== event.page) {
      this.userParams.pageNumber = event.page;
      this.loadMembers();
    }
  }
}
