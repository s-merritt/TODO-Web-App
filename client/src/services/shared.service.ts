import { Injectable, Component, Input, Output, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class SharedService {
  @Output() fire: EventEmitter<any> = new EventEmitter();
  current: boolean;

  constructor() { 
    console.log("began shared service");
    this.current = false;
  }

  change(){
    console.log("change started");
    if(!this.current)
      this.fire.emit(this.current = true);
    else{
      this.fire.emit(this.current = false);
    }
    console.log("change completed");
  }

  getEmittedValue(){
    return this.fire;
  }
}
