import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { VirtualKeyboardComponent } from '../virtual-keyboard.component';
@Injectable({
  providedIn: 'root'
})
export class VirtualKeyboardEventsService {

  private eventSubject = new BehaviorSubject<VirtualKeyboardComponent | null>(null);
  //In the VK component there is attribute parameter like: 'acceptWithIDCallBack'
  //<lib-VirtualKeyboard [language]="'en'" [acceptWithIDCallBack]="acceptWithVK_ID" [vk_id]="'007'"></lib-VirtualKeyboard>
  //This attribute is like function pointer, and will called when we click on 'Accept' key. 
  //The 'acceptWithVK_ID'  function can only activate superficial things,
  //and you should not call the objects from this function, 
  //objects that are defined within the application, 
  //since this method is called by the virtual keyboard and does not have the app 'this' object so we will get this error:
  //Cannot read properties of undefined (reading 'xxx')
  //To fix that problem We need to declare accept event that will capture at app component, And then We can used and execute complicated thing    
  private acceptSubject = new BehaviorSubject<VirtualKeyboardComponent | null>(null);
  constructor() { }


  emitEvent(event: VirtualKeyboardComponent) {
    this.eventSubject.next(event);
  }

  getEvent() {
    return this.eventSubject.asObservable();
  }

  acceptEvent(event: VirtualKeyboardComponent) {
    this.acceptSubject.next(event);
  }

  getAcceptEvent() {
    return this.acceptSubject.asObservable();
  }
}
