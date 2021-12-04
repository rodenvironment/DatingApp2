import { NgForm } from '@angular/forms';
import { MembersService } from './../../_services/members.service';
import { MessageService } from './../../_services/message.service';
import { Message } from './../../_models/message';
import { Component, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css']
})
export class MemberMessagesComponent implements OnInit {

  @Input() messages: Message[] = [];
  @Input() username: string = '';
  messageContent = '';

  @ViewChild('messageForm') messageForm!: NgForm;

  constructor(private messageService: MessageService) { }

  ngOnInit(): void {}

  sendMessage() {
    this.messageService.sendMessage(this.username, this.messageContent).subscribe(message => {
      this.messages.push(message);
      this.messageForm.reset();
    });
  }

}
