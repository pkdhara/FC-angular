import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {first} from "rxjs/operators";
import {Router} from "@angular/router";
import { UserService } from '../user.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {

  addForm: FormGroup;

  constructor(private formBuilder: FormBuilder,private router: Router,
    private userService : UserService) {
    this.addForm = this.formBuilder.group({
      id: [],
      email: ['', Validators.required],
      fname: ['', Validators.required],
      lname: ['', Validators.required]
    });
   }

  

  ngOnInit() {   

  }

  onSubmit() {
    this.userService.createUser(this.addForm.value)
      .subscribe( data  => {
        this.router.navigate(['dashboard/list-user']);
      });
  }

}