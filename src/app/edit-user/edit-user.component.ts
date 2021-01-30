import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { User } from '../model/user.model';
import { UserService } from '../user.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {
  editForm : FormGroup;
  user: User = new User();

  constructor(private formBuilder: FormBuilder,private router: Router,
    private userService : UserService) { 
      this.editForm = this.formBuilder.group({
        id: [],
        emailId: ['', Validators.required],
        firstName: ['', Validators.required],
        username: [''],
        password: [''],
        access: [''],
        phoneNumber : [''],
        active : []
      });
    }

  ngOnInit() {
    let userId = localStorage.getItem("editUserId");
    if(!userId) {
      alert("Invalid action.")
      this.router.navigate(['dashboard/list-user']);
      return;
    }
    
    this.userService.getUserById(userId)
      .subscribe( data => {
        this.editForm.setValue(data);
      });
  }

  onSubmit() {
    this.router.navigate(['dashboard/list-user']);
  }


}