import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';
import { FirebaseAuth } from 'angularfire2';
import { AngularFireDatabase } from 'angularfire2/database';


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
              private router: Router) { 
    this.user = fAuth.authState;

  }

  emailSignUp(email: string, password: string) {
    this.fAuth.auth
      .createUserWithEmailAndPassword(email, password)
      .then(credential => {
        return this.updateUserData(credential.user); // if using firestore
      })
      .catch(function(error){
        var errorCode = error.code;
        if(errorCode === 'auth/email-already-in-use'){
          alert("user already exists!");
          return false;
        }
        else if(errorCode === 'auth/invalid-email'){
          alert("invalid email!");
          return false;
        }
        else if(errorCode == 'auth/operation-not-allowed'){
          alert("invalid op");
          return false;
        }
        else if(errorCode = 'auth/weak-password'){
          alert("password too weak");
          return true;
        }
        else
          console.log(error.message);
      });
      return true;
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
