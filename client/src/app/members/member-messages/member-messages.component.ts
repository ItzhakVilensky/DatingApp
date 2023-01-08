import { Component, Input } from '@angular/core';
import { IMessage } from 'src/app/_models/message';

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css']
})
export class MemberMessagesComponent {

  @Input() username?: string;
  @Input() messages?: IMessage[] | undefined = [];
}
