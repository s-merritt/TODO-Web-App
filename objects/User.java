package objects;

import java.util.ArrayList;

public class User{
 private final String UserID; //unique to each user
 private int notification; //stretch feature TBD
 private ArrayList<String> TaskIDs;  //list of Task IDs

 public User(String UserID){
    this.UserID = UserID;
    this.notification = 0; //default off
    this.TaskIDs = new ArrayList<String>(10);
 }

 public String getUserID(){
    return this.UserID;
 }

 public int getNotification(){
    return this.notification;
 }

 public ArrayList<String> getTaskIDs(){
    return this.TaskIDs;
 }

 public void setNotification(int value){
    this.notification = value;
 }

 public void addTask(String TaskID){
    this.TaskIDs.add(TaskID);
 }

 public void removeTask(String TaskID){
    this.TaskIDs.remove(TaskID);
 }

 @Override
 public String toString(){
    return "UserID: " + this.UserID
            + " Notification: " + this.notification
            + " Task IDs: " + this.TaskIDs.toString();
 }
}