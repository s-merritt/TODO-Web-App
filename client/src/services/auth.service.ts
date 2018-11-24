import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';
import { AngularFirestore } from 'angularfire2/firestore';
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
              private db: AngularFirestore, 
              private router: Router,
              private snackbar: MatSnackBar) { 
    this.user = fAuth.authState;

  }

  emailSignUp(email: string, password: string) {
    this.fAuth.auth
      .createUserWithEmailAndPassword(email, password)
      .then(credential => {
        let snackRef = this.snackbar.open("Registration Successful! Please login to your new account to proceed.")
        //create new user and stat object to add to firestore
        this.db.collection("users").doc(email).set({
            notification: false,
            TaskIDs: [],
            TasksCompleted: 0,
            TasksIncomplete: 0,
            startTime: firebase.firestore.FieldValue.serverTimestamp() //get Timestamp
        })
        .then(result => {
            console.log("new user added");
        })
        .catch(error => {
            console.log("error adding user");
            console.log(error.message);
        });
      })     
      .catch(error => {
        var errorCode = error.code;
        if(errorCode === 'auth/email-already-in-use'){
          let snackRef = this.snackbar.open("Email already in use! Please try a different email.");
        }
        else if(errorCode === 'auth/invalid-email'){
          let snackRef = this.snackbar.open("Please use a valid email address!");
        }
        else if(errorCode == 'auth/operation-not-allowed'){
          let snackRef = this.snackbar.open("Invalid Operation");
        }
      });
  }

  emailLogin(email: string, password: string) {
    this.fAuth.auth
      .signInWithEmailAndPassword(email, password)
      .then(credential => {
        let snackRef = this.snackbar.open("Login Successful");
      })
      .catch(error => {
        var errorCode = error.code;
        if(errorCode === 'auth/user-not-found'){
          let snackRef = this.snackbar.open("Email/Password do not match, try again!");
        }
      });
  }
}
