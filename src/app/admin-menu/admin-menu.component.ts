import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';

@Component({
  selector: 'app-admin-menu',
  templateUrl: './admin-menu.component.html',
  styleUrls: ['./admin-menu.component.css']
})
export class AdminMenuComponent implements OnInit {

  accessCodes: string[] = [];
  FCUID: string | null;
  constructor(private userService: UserService) {
    this.getAccessCodes();
    this.FCUID = localStorage.getItem('FCUID') ? localStorage.getItem('FCUID') : '';
  }

  ngOnInit(): void {
  }

  switchtoJSP(destination: string) {
    window.location.href = 'https://localhost:8443/clearSession.jsp?FCUID='+ this.FCUID +'&dest=' + destination;
  }

  getAccessCodes() {
    this.userService.getAccess()
      .subscribe(data => {
        this.accessCodes = data;
      }, err => { console.log(err) });
  }

  checkIfAccessPresent(key: string) {
    if (this.accessCodes.indexOf(key) > -1) {
      return true;
    } else {
      return false;
    }
  }

}
