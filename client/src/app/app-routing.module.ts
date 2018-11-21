import { NgModule } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';

const appRoutes: Routes = [
  {path: 'login', component: LoginComponent },
];

@NgModule({
  exports: [RouterModule]
})
export class AppRoutingModule { 

  private loginURL = '/app/login';
  private homeURL = '/app/home';
  private profileURL = '/app/profile';
  public connected = false;

  constructor(private router: Router){

  }

}
