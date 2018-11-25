import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private mAuth: AngularFireAuth,
              private router: Router) { }

  ngOnInit() {

  }

  logout(){
    //sign out and redirect to login page
    this.mAuth.auth.signOut();
    this.router.navigateByUrl('/login');
  }


}
