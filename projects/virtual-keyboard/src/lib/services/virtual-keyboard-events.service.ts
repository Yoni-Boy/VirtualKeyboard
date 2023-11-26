import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { VirtualKeyboardComponent } from '../virtual-keyboard.component';
@Injectable({
  providedIn: 'root'
})
export class VirtualKeyboardEventsService {

  private eventSubject = new BehaviorSubject<VirtualKeyboardComponent | null>(null);

  constructor() { }


  emitEvent(event: VirtualKeyboardComponent) {
    this.eventSubject.next(event);
  }

  getEvent() {
    return this.eventSubject.asObservable();
  }

}
