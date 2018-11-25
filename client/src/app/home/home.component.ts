import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';

interface User {
  TaskIDs: Task[];
  TasksCompleted: number;
  TasksIncomplete: number;
  notifcation: Boolean;
  startTime: firebase.firestore.Timestamp;
}

interface Task{
  desc: String;
  setTime: firebase.firestore.Timestamp;
  status: number;
  title: String;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private mAuth: AngularFireAuth,
              private router: Router,
              private db: AngularFirestore, 
              ) { }

  ngOnInit() {
    //don't allow users who aren't logged in to access this page
    var user = this.mAuth.auth.currentUser;
    if(user == null){
      this.router.navigateByUrl('/login');
    }
    //this.getTasks();
  }

  createTask(){
    alert("create task!");
  }

  getTasks(){
    var userDocRef = this.db.collection("users").doc(this.mAuth.auth.currentUser.email);
    userDocRef.get().subscribe(result =>{
      if(result.exists){
        console.log("found user doc");

        //get list of TaskIDs
        var list = result.get("TaskIDs");
        list.array.forEach(TaskID => {
          var taskDocRef = this.db.collection("tasks").doc(TaskID);
          taskDocRef.get().subscribe(result =>{
            if(result.exists){
              //create local Task object from result
               const task: Task = {
                 desc: result.get("description"),
                 setTime: result.get("setTime"),
                 status: result.get("status"),
                 title: result.get("title")
               };

               console.log(task);
               //TODO parse task and display on page
            }
            else{
              console.log("could not find taskID: " + TaskID);
            }
          });
        });
      }
      else{
        console.log("could not find user doc");
      }
    });
  }

  logout(){
    //sign out and redirect to login page
    this.mAuth.auth.signOut();
    this.router.navigateByUrl('/login');
  }


}
