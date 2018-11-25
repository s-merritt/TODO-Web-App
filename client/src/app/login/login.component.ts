import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from '../../services/auth.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';

export interface DialogData{
  email: string;
  password: string;
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

  mAuth: AuthService;
  fAuth: AngularFireAuth;

  constructor(mAuth: AuthService, public dialog: MatDialog, public router: Router, fAuth: AngularFireAuth) {
    this.mAuth = mAuth;
    this.fAuth = fAuth;
    var user = this.fAuth.auth.currentUser;
    if(user != null){
      if(user.emailVerified){
        this.router.navigateByUrl('/home');
      }
    }
   }

  ngOnInit() {
    //if already logged in, redirect to home page
    var user = this.fAuth.auth.currentUser;
    if(user != null){
      if(user.emailVerified){
        this.router.navigateByUrl('/home');
      }
    }
  }

  onLogin(){
    this.mAuth.emailLogin(this.emailField, this.pswdField);
  }

  onReg(){
    //create dialog box
    let dialogRef = this.dialog.open(LoginDialog, {
      height: '300px',
      width: '300px',
      data: {email: this.newEmail, password: this.newPass}
    });   
  }

}

@Component({
  selector: 'login-dialog',
  templateUrl: 'dialog.html'
})
export class LoginDialog {
  constructor(public snackbar: MatSnackBar, 
              public mAuth: AuthService, 
              public dialogRef: MatDialogRef<LoginDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData){
    }

  attemptReg(){
    this.mAuth.emailSignUp(this.data.email, this.data.password);
  }

  closeDiag(){
    this.dialogRef.close();
  }
}
