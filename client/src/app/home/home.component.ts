import { Component, OnInit, Inject } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material';

import { AngularFirestore } from 'angularfire2/firestore';
import * as firebase from 'firebase';
import { AuthService } from 'src/services/auth.service';

interface Task {
  ID: string;
  description: string;
  status: number;
  title: string;
  weekday: number;
}

export interface TaskDialogData {
  description: string,
  title: string,
  day: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  //Fields
  descF: string;
  titleF: string;
  setDayF: number;

  AllTasks: Task[] = [];
  sundayTasks: Task[] = [];
  mondayTasks: Task[] = [];
  tuesdayTasks: Task[] = [];
  wednesdayTasks: Task[] = [];
  thursdayTasks: Task[] = [];
  fridayTasks: Task[] = [];
  saturdayTasks: Task[] = [];

  constructor(private fAuth: AngularFireAuth,
    private router: Router,
    private db: AngularFirestore,
    public dialog: MatDialog) { }

  ngOnInit() {
    //don't allow users who aren't logged in to access this page
    var user = this.fAuth.auth.currentUser;
    if (user == null) {
      console.log("user not logged in, re-routing");
      this.router.navigateByUrl('/login');
      return;
    }
    this.getTasks();
  }

  createTask() {
    let dialogRef = this.dialog.open(TaskDialog, {
      height: '500px',
      width: '500px',
      data: {
        description: this.descF,
        title: this.titleF,
        day: this.setDayF
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getTasks();
    });
  }

  getTasks() {
    //clear lists to prevent duplication
    this.clearTaskLists();

    var userDocRef = this.db.collection("users").doc(this.fAuth.auth.currentUser.email);
    userDocRef.get().subscribe(result => {
      if (result.exists) {
        console.log("found user doc");

        //get list of TaskIDs
        const taskIDs: string[] = result.get("TaskIDs");
        taskIDs.forEach(taskID => {
          var taskDocRef = this.db.collection("tasks").doc(taskID);
          taskDocRef.get().subscribe(result => {
            if (result.exists) {
              //create local Task object from result
              const task: Task = {
                ID: taskID,
                description: result.get("description"),
                status: result.get("status"),
                title: result.get("title"),
                weekday: result.get("day")
              };

              console.log(task);
              this.AllTasks.push(task);
              //TODO parse task and display on page
              switch (task.weekday) {
                case 0:  //monday
                  this.mondayTasks.push(task);
                  break;
                case 1:  //tuesday
                  this.tuesdayTasks.push(task);
                  break;
                case 2:  //wednesday
                  this.wednesdayTasks.push(task);
                  break;
                case 3:  //thursday
                  this.thursdayTasks.push(task);
                  break;
                case 4:  //friday
                  this.fridayTasks.push(task);
                  break;
                case 5:  //saturday
                  this.saturdayTasks.push(task);
                  break;
                case 6:  //sunday
                  console.log(this.sundayTasks);
                  if (this.sundayTasks.indexOf(task) < 0) {
                    console.log(this.sundayTasks.indexOf(task))
                    this.sundayTasks.push(task);
                  }
                  break;
                default: //error
                  console.log("ERROR: invalid number for weekday");
              }

            }
            else {
              console.log("could not find taskID: " + taskID);
            }
          });
        });
      }
      else {
        console.log("could not find user doc");
      }
    });
  }

  clearTaskLists() {
    this.AllTasks = [];
    this.sundayTasks = [];
    this.mondayTasks = [];
    this.tuesdayTasks = [];
    this.wednesdayTasks = [];
    this.thursdayTasks = [];
    this.fridayTasks = [];
    this.saturdayTasks = [];
  }

  updateStatus(task: Task) {
    var curStatus = task.status;
    var newStatus = 0;

    if (curStatus == 1)
      newStatus = 0;
    else if (curStatus == 0)
      newStatus = 1;

    //update status of that task in DB
    this.db.collection("tasks").doc(task.ID).set({
      status: newStatus
    }, {merge: true});

  }
}

@Component({
  selector: 'task-dialog',
  templateUrl: 'TaskDialog.html',
  styleUrls: ['./TaskDialog.css']

})
export class TaskDialog {
  constructor(public dialogRef: MatDialogRef<TaskDialog>,
    @Inject(MAT_DIALOG_DATA) public data: TaskDialogData, public snackbar: MatSnackBar, public db: AngularFirestore, public fAuth: AuthService) { }

  createTask() {
    var count = 0;
    this.db.collection("tasks").get().subscribe(result => {
      if (result != null) {
        count = result.size;

        //add task to Firestore, ID will be [email + taskIDs.length]    
        const taskID: string = this.fAuth.getEmail() + count;
        
        //create Task object with data form dialog
        const task: Task = {
          ID: taskID,
          description: this.data.description,
          title: this.data.title,
          status: 0,
          weekday: this.data.day
        };

        this.db.collection("tasks").doc(taskID).set({
          description: task.description,
          title: task.title,
          status: task.status,
          day: task.weekday
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
        this.db.collection("users").doc(this.fAuth.getEmail()).set({
          TaskIDs: firebase.firestore.FieldValue.arrayUnion(taskID)
        }, { merge: true }) //set merge to true so we don't lose other fields
          .then(result => {
            console.log("task added successfully to user's list in Firestore");
            let snackRef = this.snackbar.open("Task Created!");
            this.closeDiag();
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
