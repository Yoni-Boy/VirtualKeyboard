import { AfterViewInit, Component, OnInit } from '@angular/core';
import { VirtualKeyboardEventsService } from 'projects/virtual-keyboard/src/public-api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {

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