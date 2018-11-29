import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { AngularFirestore } from 'angularfire2/firestore';
import { MatSnackBar } from '@angular/material';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  constructor(private fAuth: AngularFireAuth, 
              private db: AngularFirestore, 
              private router: Router,
              private snackbar: MatSnackBar,
              private ss: SharedService) { 
                console.log("starting up auth service");
              }

  emailSignUp(email: string, password: string) {
    this.fAuth.auth
      .createUserWithEmailAndPassword(email, password)
      .then(credential => {
        //create new user and stat object to add to firestore
        this.db.collection("users").doc(email).set({
            notification: false,
            TaskIDs: [],
            TasksCompleted: 0,
            TasksIncomplete: 0,
            startTime: firebase.firestore.FieldValue.serverTimestamp() //get Timestamp
        });

        //send email verification link
        credential.user.sendEmailVerification()
        .then(function(){
          //email was sent
          console.log("email link sent to " + email);
        })
        .catch(error => {
          console.log("error occurred when sending email link");
          console.log(error.message);
        });

        //notify user
        let snackRef = this.snackbar.open("Registration Successful! Please check your email for a verification link");
        //log response
        console.log("new user added");

      }) //end createUser then 
      .catch(error => {
        console.log("error adding user");
        console.log(error.message);
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
    //check if user has verified their email address
    var user = this.fAuth.auth.currentUser;
    if(user != null){
      if(!user.emailVerified){
        let snackRef = this.snackbar.open("Email not verified. Please verify email address before logging in.");
        return;
      }
      else{
      }
    }
    this.fAuth.auth
      .signInWithEmailAndPassword(email, password)
      .then(credential => {
        //check if email is verified before proceeding
        if(credential.user.emailVerified){
          let snackRef = this.snackbar.open("Login Successful");
          this.router.navigateByUrl('/home');
          this.ss.change(); //linked to navigation component to display buttons
        }
        else{
          let snackRef = this.snackbar.open("Email not verified. Please verify email address before logging in.");
          this.fAuth.auth.signOut()
          .catch(error => {
            console.log("error occured with sign out");
            console.log(error.message);
          });
        }
      })
      .catch(error => {
        var errorCode = error.code;
        if(errorCode === "auth/user-not-found" || errorCode === "auth/wrong-password"){
          let snackRef = this.snackbar.open("Email/Password do not match anything in our records, try again!");
        }
      });
  }

  getEmail(): string{
    return this.fAuth.auth.currentUser.email;
  }
}
