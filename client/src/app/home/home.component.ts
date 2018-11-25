import { Component, OnInit, Inject } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material';

import { AngularFirestore } from 'angularfire2/firestore';
import * as firebase from 'firebase';
import { AuthService } from 'src/services/auth.service';


interface Task {
  description: string;
  setTime: Date;
  status: number;
  title: string;
}

export interface TaskDialogData {
  description: string,
  setTime: Date,
  title: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  //Fields
  descF: string;
  setTimeF: Date;
  titleF: string;

  constructor(private mAuth: AngularFireAuth,
    private router: Router,
    private db: AngularFirestore,
    public dialog: MatDialog) { }

  ngOnInit() {
    //don't allow users who aren't logged in to access this page
    var user = this.mAuth.auth.currentUser;
    if (user == null) {
      this.router.navigateByUrl('/login');
    }
    //this.getTasks();
  }

  createTask() {
    let dialogRef = this.dialog.open(TaskDialog, {
      height: '500px',
      width: '500px',
      data: {
        description: this.descF,
        setTime: this.setTimeF,
        title: this.titleF
      }
    });
  }

  getTasks() {
    var userDocRef = this.db.collection("users").doc(this.mAuth.auth.currentUser.email);
    userDocRef.get().subscribe(result => {
      if (result.exists) {
        console.log("found user doc");

        //get list of TaskIDs
        const taskIDs: string[] = result.get("TaskIDs");
        taskIDs.forEach(TaskID => {
          var taskDocRef = this.db.collection("tasks").doc(TaskID);
          taskDocRef.get().subscribe(result => {
            if (result.exists) {
              //create local Task object from result
              const task: Task = {
                description: result.get("description"),
                setTime: result.get("setTime"),
                status: result.get("status"),
                title: result.get("title")
              };

              console.log(task);
              //TODO parse task and display on page
            }
            else {
              console.log("could not find taskID: " + TaskID);
            }
          });
        });
      }
      else {
        console.log("could not find user doc");
      }
    });
  }

  logout() {
    //sign out and redirect to login page
    this.mAuth.auth.signOut();
    this.router.navigateByUrl('/login');
  }
}

@Component({
  selector: 'task-dialog',
  templateUrl: 'TaskDialog.html'
})
export class TaskDialog {
  constructor(public dialogRef: MatDialogRef<TaskDialog>,
    @Inject(MAT_DIALOG_DATA) public data: TaskDialogData, public snackbar: MatSnackBar, public db: AngularFirestore, public mAuth: AuthService) { }

  createTask() {
    //create Task object with data form dialog
    const task: Task = {
      description: this.data.description,
      setTime: this.data.setTime,
      title: this.data.title,
      status: 0
    };

    var count = 0;
    this.db.collection("tasks").get().subscribe(result => {
      if (result != null) {
        count = result.size;
        //add task to Firestore, ID will be [email + taskIDs.length]    
        const taskID: string = this.mAuth.getEmail() + count;
        this.db.collection("tasks").doc(taskID).set({
          description: task.description,
          setTime: task.setTime,
          title: task.title,
          status: task.status
        })
          .then(result => {
            console.log("Task successfully added to Firestore")
          })
          .catch(error => {
            console.log("error when adding task to Firestore");
            console.log(error.message);
            console.log(error.code);
            let snackRef = this.snackbar.open("There was an issue with adding your task, please try again.");
            return;
          });

        //make sure to add TaskID to user's list of TaskIDs
        this.db.collection("users").doc(this.mAuth.getEmail()).set({
          TaskIDs: firebase.firestore.FieldValue.arrayUnion(taskID)
        }, {merge: true}) //set merge to true so we don't lose other fields
          .then(result => {
            console.log("task added successfully to user's list in Firestore");
            let snackRef = this.snackbar.open("Task Created!");
          })
          .catch(error => {
            console.log("error when adding task to firestore");
            console.log(error.message);
            console.log(error.code);
            let snackRef = this.snackbar.open("There was an issue with adding your task, please try again.");
            return;
          });
      }
    });


  }

  closeDiag() {
    this.dialogRef.close();
  }

}
