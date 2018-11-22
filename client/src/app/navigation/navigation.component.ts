import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  home(){
    this.router.navigateByUrl('/home');
  }

  login(){
    this.router.navigateByUrl('/login');
  }

  profile(){
    this.router.navigateByUrl('/profile');
  }
}
