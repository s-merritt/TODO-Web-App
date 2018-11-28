import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  isLoggedIn: boolean = false;

  constructor(private mAuth: AuthService, public router: Router, private fAuth: AngularFireAuth) {
    var user = this.fAuth.auth.currentUser;
    if(user != null){
      if(user.emailVerified){
        console.log("user logged in and verified!");
        this.isLoggedIn = true;
      }
      else{
        console.log("user not verified!");
        this.isLoggedIn = false;
      }
    }
    else{
      console.log("user not logged in for this session");
      this.isLoggedIn = false;
    }
   }

  ngOnInit() {
  }

  home(){
    this.router.navigateByUrl('/home');
  }

  profile(){
    this.router.navigateByUrl('/profile');
  }

}
