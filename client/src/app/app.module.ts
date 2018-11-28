import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { LoginComponent, LoginDialog } from './login/login.component';
import { HomeComponent, TaskDialog } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { NavigationComponent } from './navigation/navigation.component';
import { RouterModule, Routes } from '@angular/router';

import { environment } from '../environments/environment';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';

import { MatDialogModule, 
        MatButtonModule, 
        MatFormFieldModule,
        MatSnackBarModule,
        MatTableModule,
        MatCardModule,
        MatExpansionModule,
        MatCheckboxModule,
        MatToolbarModule
       } from '@angular/material';

import {DragDropModule} from '@angular/cdk/drag-drop';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {CdkTableModule} from '@angular/cdk/table';
import {CdkTreeModule} from '@angular/cdk/tree';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

const appRoutes: Routes = [
  { path: '', redirectTo: 'login', pathMatch:'full'},
  { path: 'home', component: HomeComponent},
  { path: 'login', component: LoginComponent},
  { path: 'profile', component: ProfileComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    ProfileComponent,
    NavigationComponent,
    LoginDialog,
    TaskDialog,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes, {enableTracing: true}),
    AngularFireModule.initializeApp(environment.firebase, 'angular-auth-firebase'),
    AngularFirestoreModule,
    AngularFireAuthModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatTableModule,
    MatFormFieldModule,
    MatCardModule,
    CdkTableModule,
    CdkTreeModule,
    DragDropModule,
    ScrollingModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatToolbarModule
  ],
  entryComponents: [LoginDialog, TaskDialog],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
