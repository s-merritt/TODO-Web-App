import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';
import { AngularFireDatabase } from 'angularfire2/database';
import { MatSnackBar } from '@angular/material';



interface User{
  email: string;
  //notification: number; ??
  //TaskID?
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private user: Observable<firebase.User>;

  constructor(private fAuth: AngularFireAuth, 
              private db: AngularFireDatabase, 
              private router: Router,
              private snackbar: MatSnackBar) { 
    this.user = fAuth.authState;

  }

  emailSignUp(email: string, password: string) {
    this.fAuth.auth
      .createUserWithEmailAndPassword(email, password)
      .then(credential => {
        let snackRef = this.snackbar.open("Registration Successful!")
        return this.updateUserData(credential.user); // if using firestore
      })     
      .catch(error => {
        var errorCode = error.code;
        if(errorCode === 'auth/email-already-in-use'){
          let snackRef = this.snackbar.open("Email Already In Use! Please try a different email.");
        }
        else if(errorCode === 'auth/invalid-email'){
          let snackRef = this.snackbar.open("Please Use a Valid Email!");
          return false;
        }
        else if(errorCode == 'auth/operation-not-allowed'){
          let snackRef = this.snackbar.open("Invalid Operation");
        }
      });
  }

  emailLogin(email: string, password: string) {
    this.fAuth.auth
      .signInWithEmailAndPassword(email, password)
      .catch(function(error){
        var errorCode = error.code;
        if(errorCode === 'auth/user-not-found'){
          alert("user not found");
          return false;
        }
        else return true;
      });
      return true;
  }

  private updateUserData(user: User){

  }
}
