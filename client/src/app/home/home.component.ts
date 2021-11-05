import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  registered = false;
  url = 'https://localhost:5003/api/users/';

  constructor() { }

  ngOnInit(): void {
  }

  toggleRegistered() {
    this.registered = !this.registered;
    console.log(this.registered);
  }

  cancelRegister(event: boolean) {
    this.registered = event;
  }

}
