import { Component, OnInit, isDevMode } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService
  ) {
    
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const username = this.loginForm.get('username')?.value;
      const password = this.loginForm.get('password')?.value;

      this.userService.getToken(username, password).subscribe(
        (token: any) => {
          console.log(token);
          var currentTime = new Date();
          localStorage.setItem('access_token', token['access_token']);
          localStorage.setItem('refresh_token', token['refresh_token']);
          currentTime.setTime(currentTime.getTime() + (token['expires_in'] * 1000) - 10);
          localStorage.setItem('expires_by', currentTime.getTime().toString());
          // this.router.navigate(['dashboard']);
          debugger;
          this.userService.getDashboardLocation(password, username).subscribe(
            (data: any) => {
              const dbError = data['dbError'];
              const dest = data['destination'];
              const FCUID = data['myFCUID'];
              if (!dbError) {
                localStorage.setItem('FCUID', FCUID);
                // window.location.href = 'https://localhost:8443/clearSession.jsp?FCUID=' + FCUID
                //   + '&dest=' + dest;
              } else {
                this.router.navigate(['']);
              }
            }, err => {
              console.log(err);
              this.router.navigate(['']);
            }
          )
        }, error => {
          console.log(error);
          this.router.navigate(['']);
        }
      )
    }
  }

}
