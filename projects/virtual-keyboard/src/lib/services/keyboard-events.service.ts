import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { KeyboardV3Component } from '../keyboard-v3/keyboard-v3.component';

@Injectable({
  providedIn: 'root'
})
export class KeyboardEventsService {

  private eventSubject = new BehaviorSubject<KeyboardV3Component | null>(null);

  constructor() { }


  emitEvent(event: KeyboardV3Component) {
    this.eventSubject.next(event);
  }

  getEvent() {
    return this.eventSubject.asObservable();
  }

}
