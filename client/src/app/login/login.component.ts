import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


export interface DialogData{
  email: string;
  password: string;
}


import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material';

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


  constructor(mAuth: AuthService, public dialog: MatDialog) {
    this.mAuth = mAuth;
   }

  ngOnInit() {
  }

  onLogin(){
    if(this.mAuth.emailLogin(this.emailField, this.pswdField))
      alert("login successful!");
  }

  onReg(){
    //create dialog box
    let dialogRef = this.dialog.open(LoginDialog, {
      height: '400px',
      width: '600px',
      data: {email: this.newEmail, password: this.newPass}
    });

    dialogRef.afterClosed().subscribe(result => {

    });

    
  }

}

@Component({
  selector: 'login-dialog',
  templateUrl: 'dialog.html'
})
export class LoginDialog {
  constructor(public snackbar: MatSnackBar, public mAuth: AuthService, public dialogRef: MatDialogRef<LoginDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData){
    }

  attemptReg(){
    this.mAuth.emailSignUp(this.data.email, this.data.password);
  }

}
