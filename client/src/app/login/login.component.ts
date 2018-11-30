import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from '../../services/auth.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import { SharedService } from 'src/services/shared.service';

export interface DialogData {
  email: string;
  password: string;
  password2: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  emailField: string;
  pswdField: string;

  newEmail: string;
  newPass: string;

  constructor(private ss: SharedService, private mAuth: AuthService, public dialog: MatDialog, public router: Router, private fAuth: AngularFireAuth) { }

  ngOnInit() {
    //if already logged in, redirect to home page
    this.fAuth.auth.onAuthStateChanged(function(user) {
      if(user){
        this.router.navigateByUrl('/home');
        window.location.reload();
        this.ss.change();
        console.log("user already logged in for this session");
      }
      else{
        console.log("user not logged in for this session yet");

      }
    }.bind(this));
  }

  onLogin() {
    this.mAuth.emailLogin(this.emailField, this.pswdField);
  }

  onReg() {
    //create dialog box
    let dialogRef = this.dialog.open(LoginDialog, {
      height: '300px',
      width: '300px',
      data: { email: this.newEmail, password: this.newPass }
    });
  }

}

@Component({
  selector: 'login-dialog',
  templateUrl: 'dialog.html'
})
export class LoginDialog {
  private isValid: boolean;

  constructor(public mAuth: AuthService,
    public dialogRef: MatDialogRef<LoginDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.isValid = true;
  }

  attemptReg() {
    if (this.data.password != this.data.password2) {
      this.isValid = false;
    }
    else {
      this.isValid = true;
      this.mAuth.emailSignUp(this.data.email, this.data.password);
    }
  }

  closeDiag() {
    this.dialogRef.close();
  }
}
