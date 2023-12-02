import { AfterViewInit, Component, OnInit } from '@angular/core';
import { KeyboardLayout, VirtualKeyboardEventsService } from 'projects/virtual-keyboard/src/public-api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {


  custom_Keyboard: KeyboardLayout =
  {
    name: "ms-custom_keyboard",
    lang: "ck",
    default: [
      "` 1 2 3 4 5 6 7 8 9 0 - = {bksp}",
      "{tab} j o n a t h a n [ ] \\",
      "{lock} n e c h e m i a ; ' {enter}",
      "{shift} z x c v b n m , . / {shift}",
      "{accept} .com @ {space}"
    ],
    shift: [
      "~ ! @ # $ % ^ & * ( ) _ + {bksp}",
      "{tab} Q W E R T Y U I O P { } |",
      '{lock} A S D F G H J K L : " {enter}',
      "{shift} Z X C V B N M < > ? {shift}",
      "{accept} .com @ {space}"
    ],
    alt: [
      "{empty} {empty} {empty} {empty} \u20aa {empty} {empty} {empty} {empty} {empty} {empty} \u05bf {empty} {bksp}",
      "{tab} {empty} {empty} \u20ac {empty} {empty} {empty} \u05f0 {empty} {empty} {empty} {empty} {empty} {empty}",
      "{empty} {empty} {empty} {empty} {empty} \u05f2 \u05f1 {empty} {empty} {empty} {empty} {enter}",
      "{shift} {empty} {empty} {empty} {empty} {empty} {empty} {empty} {empty} {empty} {empty} {empty} {shift}",
      "{accept} {alt} {space} {alt} {cancel}"
    ],
    getDefaultDiplay() {
      return {
        "{bksp}": "backspace",
        "{backspace}": "backspace",
        "{enter}": "< enter",
        "{shift}": "shift",
        "{shiftleft}": "shift",
        "{shiftright}": "shift",
        "{alt}": "alt",
        "{s}": "shift",
        "{tab}": "tab",
        "{lock}": "caps",
        "{capslock}": "caps",
        "{accept}": "Accept",
        "{space}": " ",
        "{//}": " ",
        "{esc}": "esc",
        "{escape}": "esc"
      }
    }
  }


  constructor(private keyboardEventsService: VirtualKeyboardEventsService) { }

    ngAfterViewInit(): void {

    }
    ngOnInit(): void {
      //Here We define the event listener, When We Focus on the Input filed  we will capture the event here
      // Data variable is a 'VirtualKeyboardComponent' type 
      //This event handler helps us to hide the all virtual keyboards that display and we will hide them and 
      //Show the only specific virtual keyboard (that We focus on)
      this.keyboardEventsService.getEvent().subscribe(data => {
        if (data != null) {
          const all_keyboards = document.querySelectorAll('.simple-keyboard');
          //convert node list to an array
          const rows = Array.from(all_keyboards) as HTMLDivElement[];
          rows.forEach(function (value) {
            value.hidden = true; // We hide the all keyboards component 
          });
          //We show the only focus input keyboard component 
          data.div_keyboard.nativeElement.hidden = false;
          
        }
        
      });
  }
  public validate(value: string): boolean {
    
    return true;
  }
  public accept(value: string){
    alert('accept:' + value);
    
  }

  public validateNumber(value: string): boolean {
    if (!isNaN(parseFloat(String(value))) && isFinite(Number(value)))
      return true;
    else
      return false;
  }


}