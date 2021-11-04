import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit{

  url = 'https://localhost:5003/api/users/';
  title = 'The Dating App';
  users: any;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getUsers();
  }


  private getUsers() {
    this.http.get(this.url).subscribe(result => {
      this.users = result;
    }, error => {
      console.log(error);
    });
  }
}
