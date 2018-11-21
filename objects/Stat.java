package objects;

import com.google.firebase.Timestamp;

public class Stat{
    private final String userID; //FK, techincally can be PK as well
    private final Timestamp startDate;
    private int numCompletedTasks;
    private int numIncompleteTasks;

    public Stat(String userID, Timestamp startDate){
        this.userID = userID;
        this.startDate = startDate;
        numCompletedTasks = 0;
        numIncompleteTasks = 0;
    }

    public String getUserID(){
        return this.userID;
    }

    public Timestamp getStartDate(){
        return this.startDate;
    }

    public int getNumComplete(){
        return this.numCompletedTasks;
    }

    public int getNumIncomplete(){
        return this.numIncompleteTasks;
    }

    public void setNumComplete(int num){
        this.numCompletedTasks = num;
    }

    public void setNumIncomplete(int num){
        this.numIncompleteTasks = num;
    }

    public void incrComplete(){
        this.numCompletedTasks++;
    }

    public void incrIncomplete(){
        this.numIncompleteTasks--;
    }
}