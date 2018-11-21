package objects;

import com.google.firebase.Timestamp;

public class Task{
    private final String taskID; //PK
    private final String userID; //FK, probably redundant
    private Timestamp setTime; //time which the task was set to be completed (this will determine where it is displayed)
    private String title;
    private String description;

    public Task(String taskID, String userID, Timestamp setTime, String title, String description){
        this.taskID = taskID;
        this.userID = userID;
        this.setTime = setTime;
        this.title = title;
        this.description = description;
    }

    public String getTaskID(){
        return this.taskID;
    }

    public String getUserID(){
        return this.userID;
    }

    public Timestamp getSetTime(){
        return this.setTime;
    }

    public String getTitle(){
        return this.getTitle;
    }

    public String getDescription(){
        return this.description;
    }

    public void changeTime(Timestamp newTime){
        this.setTime = newTime;
    }

    public void setTitle(String title){
        this.title = title;
    }

    public void setDescription(String desc){
        this.description = desc;
    }
}