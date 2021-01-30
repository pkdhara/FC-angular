import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  loggedInUser : any;
  constructor(
    private service : UserService
  ) { }

  ngOnInit(): void {
    this.service.getSessionUser().subscribe(
      res => {
        this.loggedInUser = res;
      }, err => {
        console.log(err);
      }
    )
  }

}
