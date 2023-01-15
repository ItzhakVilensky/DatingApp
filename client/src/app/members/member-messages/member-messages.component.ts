import { Component, Input, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { IMessage } from 'src/app/_models/message';
import { MessageService } from 'src/app/_services/message.service';

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css']
})
export class MemberMessagesComponent {

  @Input() username?: string;
  @Input() messages?: IMessage[] | undefined = [];
  messageContent = '';
  @ViewChild('messageForm') messageForm?: NgForm;

  constructor(private messageService: MessageService) {

  }

  sendMessage() {
    if (!this.username) return;

    this.messageService.sendMessage(this.username, this.messageContent).subscribe({
      next: message => {
        this.messages?.push(message);
        this.messageForm?.reset();
      }
    });
  }
}
