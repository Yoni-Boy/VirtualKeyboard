import { NgModule } from '@angular/core';
import { VirtualKeyboardComponent } from './virtual-keyboard.component';
import { KeyboardV3Component } from './keyboard-v3/keyboard-v3.component';
import {VirtualKeyboardEventsService} from './services/virtual-keyboard-events.service';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [
    VirtualKeyboardComponent,
    KeyboardV3Component
  ],
  imports: [
    CommonModule
  ],
  exports: [
    VirtualKeyboardComponent
  ],
  providers: [VirtualKeyboardEventsService]
})
export class VirtualKeyboardModule { }
