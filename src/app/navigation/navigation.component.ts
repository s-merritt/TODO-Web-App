import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from 'src/services/shared.service';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  onLogin: Boolean;

  constructor(private ss: SharedService, public router: Router, private fAuth: AngularFireAuth) {
    this.onLogin = false;
    
   }

  ngOnInit() {
    //subscrive onLogin to change when the user logs in and out
    this.ss.getEmittedValue().subscribe(item => this.onLogin=item);
  }

  home(){
    this.router.navigateByUrl('/home');
  }

  profile(){
    this.router.navigateByUrl('/profile');
  }

  logout() {
    //sign out and redirect to login page
    this.fAuth.auth.signOut();
    this.ss.change(); //change onLogin
    this.router.navigateByUrl('/login');
  }

}
