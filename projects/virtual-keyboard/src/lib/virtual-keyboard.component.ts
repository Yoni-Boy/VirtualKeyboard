import { AfterViewInit, Component, ElementRef, HostListener, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { KeyboardLayout, getKeyboardLayout } from './interfaces/keyboards-layout/keyboard-layout';
import { KeyboardHandlerEvent, KeyboardInput, KeyboardOptions } from './interfaces/interfaces';
import { Position } from './interfaces/position';
import { KeyActions } from './interfaces/key-actions';
import { VirtualKeyboardEventsService } from './services/virtual-keyboard-events.service';

@Component({
  selector: 'lib-VirtualKeyboard',
  template: `
  <div (click)="$event.stopPropagation()">
  <div>
    <input #message type="text" name="message" value="" style="width:100%;"
           (keyup)="handleKeyUp($event)"
           (keydown)="handleKeyDown($event)"
           (mouseup)="handleMouseUp($event)"
           (touchend)="handleTouchEnd($event)"
           (select)="handleSelect($event)"
           (focusout)="handleFocusOut($event)"
           (selectionchange)="handleSelectionChange($event)" />

  </div>
  <div #div_keyboard [class]="keyboard_css" data-skinstance="simpleKeyboard" *ngIf="keyboardLayout"
       [style.left.px]="keyboardPosition.left"
             [style.top.px]="keyboardPosition.top">
    <div class="hg-rows">
      <div class="hg-row" *ngFor='let row_layout of keyboardLayout.default; let i = index'>
        <ng-container *ngFor='let bbb of row_layout.split(" ");let j = index'>
          <div [ngClass]="'hg-button ' + getButtonClass(bbb)" [attr.data-skbtn]="bbb" [attr.data-skbtnuid]="'default-r' + i + 'b' + j" (click)="onClick($event,bbb)">
            <span>{{getButtonDisplayName(bbb)}}</span>
          </div>
        </ng-container>
      </div>
    </div>
  </div>
</div>

  `,
  styles: [` 
    .hg-theme-default {
    user-select: none;
    box-sizing: border-box;
    overflow: hidden;
    touch-action: manipulation;
    font-family: "HelveticaNeue-Light", "Helvetica Neue Light", "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif;
    background-color: #ececec;
    padding: 5px;
    border-radius: 5px;
  }
  .hg-theme-default .hg-button span {
    pointer-events: none;
  }

  /* When using option "useButtonTag" */
  .hg-theme-default button.hg-button {
    border-width: 0;
    outline: 0;
    font-size: inherit;
  }

  .hg-theme-default .hg-button {
    display: inline-block;
    flex-grow: 1;
    cursor: pointer;
  }

  .hg-theme-default .hg-row {
    display: flex;
  }

    .hg-theme-default .hg-row:not(:last-child) {
      margin-bottom: 5px;
    }

    .hg-theme-default .hg-row .hg-button:not(:last-child) {
      margin-right: 5px;
    }

    .hg-theme-default .hg-row .hg-button-container {
      margin-right: 5px;
    }

    .hg-theme-default .hg-row > div:last-child {
      margin-right: 0;
    }

    .hg-theme-default .hg-row .hg-button-container {
      display: flex;
    }

  .hg-theme-default .hg-button {
    box-shadow: 0px 0px 3px -1px rgba(0, 0, 0, 0.3);
    height: 40px;
    border-radius: 5px;
    box-sizing: border-box;
    padding: 5px;
    background: white;
    border-bottom: 1px solid #b5b5b5;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }

    .hg-theme-default .hg-button.hg-standardBtn {
      width: 20px;
    }

    .hg-theme-default .hg-button.hg-activeButton {
      background: #efefef;
    }

  .hg-theme-default.hg-layout-numeric .hg-button {
    width: 33.3%;
    height: 60px;
    align-items: center;
    display: flex;
    justify-content: center;
  }

  .hg-theme-default .hg-button.hg-button-numpadadd {
    height: 85px;
  }

  .hg-theme-default .hg-button.hg-button-numpadenter {
    height: 85px;
  }

  .hg-theme-default .hg-button.hg-button-numpad0 {
    width: 105px;
  }

  .hg-theme-default .hg-button.hg-button-com {
    max-width: 85px;
  }

  .hg-theme-default .hg-button.hg-standardBtn.hg-button-at {
    max-width: 45px;
  }

  .hg-theme-default .hg-button.hg-selectedButton {
    background: rgba(5, 25, 70, 0.53);
    color: white;
  }

  .hg-theme-default .hg-button.hg-standardBtn[data-skbtn=".com"] {
    max-width: 82px;
  }

  .hg-theme-default .hg-button.hg-standardBtn[data-skbtn="@"] {
    max-width: 60px;
  }





/* keyboard - jQuery UI Widget */
.ui-keyboard {
  text-align: center;
  padding: .3em;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 16000;
  /* see issue #484 */
  -ms-touch-action: manipulation;
  touch-action: manipulation;
}

.ui-keyboard-has-focus {
  z-index: 16001;
}

.ui-keyboard div {
  font-size: 1.1em;
}

  `]
})
export class VirtualKeyboardComponent implements OnInit, AfterViewInit {
  @Input() keyboardLayout: KeyboardLayout | undefined;
  @Input() language: string | undefined;
  @Input() validateCallBack!: (args: string) => boolean;
  @Input() acceptCallBack!: (args: string) => boolean | void;
  //This value contain the text input  
  @ViewChild('message') _input!: ElementRef<HTMLInputElement>;
  //This value contain the virtual keyboard div 
  @ViewChild('div_keyboard') div_keyboard!: ElementRef<HTMLDivElement>;
  //This for the keyboard position
  keyboardPosition!: Position;

  //this variable responsible declare for us if we will show the shift keyboard or the default keyboard
  //This variable represent the state keyboard
  isShiftOn: boolean = false;
  //This variable save the Default keyboard, By this saving the Default keyboard We can know replace the
  //keyboardLayout.default when We click on 'shift' in the HTML code
  //*ngFor='let row_layout of keyboardLayout.default; let i = index' 
  defaultKeyboardLayout: string[]  = [];
  input!: HTMLInputElement;
  defaultName = "default";
  activeInputElement: HTMLInputElement | HTMLTextAreaElement | null = null;
  keyboard_css: string = '';
  //This variable declare for us if We make changing text value after We click on 'accept' button,
  //If We click on 'accept' button and We pass the validation then We need to change the final text value
  //Otherwise (if We not passing the validation process) then We need to return back to the previous text.       
  textBeforeAccept: string = '';

  /**
   * Getters
   */
  getOptions = (): KeyboardOptions => this.options;
  getCaretPosition = (): number | null => this.caretPosition;
  getCaretPositionEnd = (): number | null => this.caretPositionEnd;

  keyActions!: KeyActions;
  options!: KeyboardOptions;
  caretPosition!: number | null;
  caretPositionEnd!: number | null;
  /**
 * @type {boolean} Boolean value that shows whether maxLength has been reached
 */
  maxLengthReached!: boolean;



  css = {
    default: 'simple-keyboard hg-theme-default hg-layout-default',
    // keyboard id suffix
    idSuffix: '_keyboard',
    // class name to set initial focus
    initialFocus: 'keyboard-init-focus',
    // element class names
    input: 'ui-keyboard-input',
    inputClone: 'ui-keyboard-preview-clone',
    wrapper: 'ui-keyboard-preview-wrapper',
    preview: 'ui-keyboard-preview',
    keyboard: 'ui-keyboard',
    keySet: 'ui-keyboard-keyset',
    keyButton: 'ui-keyboard-button',
    keyWide: 'ui-keyboard-widekey',
    keyPrefix: 'ui-keyboard-',
    keyText: 'ui-keyboard-text', // span with button text
    keyHasActive: 'ui-keyboard-hasactivestate',
    keyAction: 'ui-keyboard-actionkey',
    keySpacer: 'ui-keyboard-spacer', // empty keys
    keyToggle: 'ui-keyboard-toggle',
    keyDisabled: 'ui-keyboard-disabled',
    // Class for BRs with a div wrapper inside of contenteditable
    divWrapperCE: 'ui-keyboard-div-wrapper',
    // states
    locked: 'ui-keyboard-lockedinput',
    alwaysOpen: 'ui-keyboard-always-open',
    noKeyboard: 'ui-keyboard-nokeyboard',
    placeholder: 'ui-keyboard-placeholder',
    hasFocus: 'ui-keyboard-has-focus',
    isCurrent: 'ui-keyboard-input-current',
    // validation & autoaccept
    inputValid: 'ui-keyboard-valid-input',
    inputInvalid: 'ui-keyboard-invalid-input',
    inputAutoAccepted: 'ui-keyboard-autoaccepted',
    endRow: 'ui-keyboard-button-endrow' // class added to <br>
  };

  self = this;


  constructor(private renderer: Renderer2, private keyboardEventsService: VirtualKeyboardEventsService) {

    this.caretPosition = 0;
    this.caretPositionEnd = 0;

    this.options = {
      layoutName: "default",
      theme: "hg-theme-default",
      inputName: "default",
      preventMouseDownDefault: false,
      enableLayoutCandidates: true,
      excludeFromLayout: {},
      debug: true
      //validate: null,
      //accept: null
      //In the constructor the validateCallBack is not initialize yet.
      //validate: this.validateCallBack


      //validate: function (/* keyboard, value, isClosing */) {
      //  return true;
      //}
      //validate: function () {
      //  return true;
      //}
    };
    this.keyboard_css = this.css.default;
    this.keyboardPosition = {
      left: 0,
      top: 0
    }
  }
  ngAfterViewInit(): void {

    this.input = <HTMLInputElement>this._input.nativeElement;
    //In the default We wont to hide the keyboard, And When We focus on the text input We wont to show the keyboard.
    this.div_keyboard.nativeElement.hidden = true;

    //In the past we declare the key actions in the options object 
    //this.options.validate = this.validateCallBack;
    //this.options.accept = this.acceptCallBack;

    this.keyActions = {
      validate: this.validateCallBack,
      accept: this.acceptCallBack
    };

  }
  ngOnInit(): void {
    if (this.keyboardLayout == undefined) {
      if (this.language != undefined) {
        this.keyboardLayout = getKeyboardLayout(this.language);
      }
      else {
        this.keyboardLayout = getKeyboardLayout('en');
      }
      if (this.keyboardLayout?.default != undefined)
        this.defaultKeyboardLayout = this.keyboardLayout.default;
    }
    // 👇️ const input: HTMLInputElement | null
    //this.input = <HTMLInputElement>this._input.nativeElement;
    //this.input = document.getElementById('message') as HTMLInputElement;
    //this.activeInputElement = this.input;
    /**
   * setEventListeners
   */
    //this.setEventListeners();


    //Here We define the event listener, When We click on the focus on the input we will capture the event here
    //!!!!! We don't use her to capture the input focus event, Because this is not working well We cannot hide external data like this:
    // data.div_keyboard.nativeElement.hidden = true; this is not work. To fix that We need to capture the event in the parent component
    // And then We need to show the child component and to hide the others children's component 
    //this.keyboardEventsService.getEvent().subscribe(data => {
    //  if (data != null) {
    //    alert(this.div_keyboard.nativeElement.hidden);
    //    if (data != this) {
    //    data.div_keyboard.nativeElement.hidden = true;
    //    if (data.language == this.language) {
    //      this.div_keyboard.nativeElement.hidden == false;
    //      alert('We need to show:' + this.language);
    //    }
    //    else {
    //      alert('We need to hide:' + this.language);
    //      this.div_keyboard.nativeElement.hidden == true;

    //    }
    //    alert(':' + data.language);
    //    }
    //    else {
    //      data.div_keyboard.nativeElement.hidden = false;
    //    }
    //  }
    //});



  }


  @HostListener('document:click', ['$event']) onDocumentClick(event: Event) {
    //In the default We wont to hide the keyboard, And When We focus on the text input We wont to show the keyboard.
    this.div_keyboard.nativeElement.hidden = true;
  }

  //In this code We try to declare event and notify the component when this event send...
  //But how We calling to this  event??? We wont to hide the all keyboard when We focus on some specific keyboard...
  //We need to find how to make broadcast event ...
  //We need to delete this line of code
  //https://medium.com/@Armandotrue/broadcasting-events-in-angular-b85289a4d685
  @HostListener('experiment')
  activeFunction() {
    alert('ddddddd'); 
  }





  /**
   * Returns the display (label) name for a given button
   *
   * @param  {string} button The button's layout name
   * @param  {object} display The provided display option
   * @param  {boolean} mergeDisplay Whether the provided param value should be merged with the default one.
   */
  getButtonDisplayName(button: string) {
    /**
     * Replaces variable buttons (such as `{bksp}`) with a human-friendly name (e.g.: `backspace`).
     */
    let display: { [button: string]: string } | undefined;

    if (this.options.mergeDisplay) {
      //display = Object.assign({}, getDefaultDiplay(), display);
      display = Object.assign({}, this.keyboardLayout?.getDefaultDiplay(), display);
    } else {
      //display = display || getDefaultDiplay();
      display = display || this.keyboardLayout?.getDefaultDiplay();
    }
    if (display != undefined)
      return display[button] || button;
    else
      return button;
  }

  /**
 * Default button display labels
 * !!!! We declare this method at KeyboardLayout interface,
 * Because this is the most correct place to define this method
 */
  //getDefaultDiplay() {
  //  return {
  //    "{bksp}": "backspace",
  //    "{backspace}": "backspace",
  //    "{enter}": "< enter",
  //    "{shift}": "shift",
  //    "{shiftleft}": "shift",
  //    "{shiftright}": "shift",
  //    "{alt}": "alt",
  //    "{s}": "shift",
  //    "{tab}": "tab",
  //    "{lock}": "caps",
  //    "{capslock}": "caps",
  //    "{accept}": "Submit",
  //    "{space}": " ",
  //    "{//}": " ",
  //    "{esc}": "esc",
  //    "{escape}": "esc",
  //    "{f1}": "f1",
  //    "{f2}": "f2",
  //    "{f3}": "f3",
  //    "{f4}": "f4",
  //    "{f5}": "f5",
  //    "{f6}": "f6",
  //    "{f7}": "f7",
  //    "{f8}": "f8",
  //    "{f9}": "f9",
  //    "{f10}": "f10",
  //    "{f11}": "f11",
  //    "{f12}": "f12",
  //    "{numpaddivide}": "/",
  //    "{numlock}": "lock",
  //    "{arrowup}": "↑",
  //    "{arrowleft}": "←",
  //    "{arrowdown}": "↓",
  //    "{arrowright}": "→",
  //    "{prtscr}": "print",
  //    "{scrolllock}": "scroll",
  //    "{pause}": "pause",
  //    "{insert}": "ins",
  //    "{home}": "home",
  //    "{pageup}": "up",
  //    "{delete}": "del",
  //    "{forwarddelete}": "del",
  //    "{end}": "end",
  //    "{pagedown}": "down",
  //    "{numpadmultiply}": "*",
  //    "{numpadsubtract}": "-",
  //    "{numpadadd}": "+",
  //    "{numpadenter}": "enter",
  //    "{period}": ".",
  //    "{numpaddecimal}": ".",
  //    "{numpad0}": "0",
  //    "{numpad1}": "1",
  //    "{numpad2}": "2",
  //    "{numpad3}": "3",
  //    "{numpad4}": "4",
  //    "{numpad5}": "5",
  //    "{numpad6}": "6",
  //    "{numpad7}": "7",
  //    "{numpad8}": "8",
  //    "{numpad9}": "9",
  //  };
  //}

  /**
 * Adds default classes to a given button
 *
 * @param  {string} button The button's layout name
 * @return {string} The classes to be added to the button
 */
  getButtonClass(button: string): string {
    const buttonTypeClass = this.getButtonType(button);
    const buttonWithoutBraces = button.replace("{", "").replace("}", "");
    let buttonNormalized = "";

    if (buttonTypeClass !== "standardBtn")
      buttonNormalized = ` hg-button-${buttonWithoutBraces}`;

    return `hg-${buttonTypeClass}${buttonNormalized}`;
  }

  /**
 * Retrieve button type
 *
 * @param  {string} button The button's layout name
 * @return {string} The button type
 */
  getButtonType(button: string): string {
    return button.includes("{") && button.includes("}") && button !== "{//}"
      ? "functionBtn"
      : "standardBtn";
  }


  /**
   * Calculate caret position offset when using rtl option
   */
  getRtlOffset(index: number, input: string) {
    let newIndex = index;
    const startMarkerIndex = input.indexOf("\u202B");
    const endMarkerIndex = input.indexOf("\u202C");

    if (startMarkerIndex < index && startMarkerIndex != -1) { newIndex--; }
    if (endMarkerIndex < index && startMarkerIndex != -1) { newIndex--; }

    return newIndex < 0 ? 0 : newIndex;
  }


  /**
   * Adds a string to the input at a given position
   *
   * @param  {string} source The source input
   * @param  {string} str The string to add
   * @param  {number} position The (cursor) position where the string should be added
   * @param  {boolean} moveCaret Whether to update simple-keyboard's cursor
   */
  addStringAt(
    source: string,
    str: string,
    position = source.length,
    positionEnd = source.length,
    moveCaret = false
  ) {
    let output;

    if (!position && position !== 0) {
      output = source + str;
    } else {
      output = [source.slice(0, position), str, source.slice(positionEnd)].join(
        ""
      );

      /**
       * Avoid caret position change when maxLength is set
       */
      if (!this.isMaxLengthReached()) {
        if (moveCaret) this.updateCaretPos(str.length);
      }
    }

    return output;
  }

  /**
   * Determines whether the maxLength has been reached. This function is called when the maxLength option it set.
   *
   * @param  {object} inputObj
   * @param  {string} updatedInput
   */
  handleMaxLength(updatedInput: string) {
    const options = this.getOptions();
    const maxLength = options.maxLength;
    const currentInput = this.input.value;
    const condition = updatedInput.length - 1 >= maxLength;

    if (
      /**
       * If pressing this button won't add more characters
       * We exit out of this limiter function
       */
      updatedInput.length <= currentInput.length
    ) {
      return false;
    }

    if (Number.isInteger(maxLength)) {
      if (options.debug) {
        console.log("maxLength (num) reached:", condition);
      }

      if (condition) {
        /**
         * @type {boolean} Boolean value that shows whether maxLength has been reached
         */
        this.maxLengthReached = true;
        return true;
      } else {
        this.maxLengthReached = false;
        return false;
      }
    }

    if (typeof maxLength === "object") {
      const condition =
        updatedInput.length - 1 >= maxLength[options.inputName || "default"];

      if (options.debug) {
        console.log("maxLength (obj) reached:", condition);
      }

      if (condition) {
        this.maxLengthReached = true;
        return true;
      } else {
        this.maxLengthReached = false;
        return false;
      }
    }
    return true; //Default value
  }


  /**
 * Moves the cursor position by a given amount
 *
 * @param  {number} length Represents by how many characters the input should be moved
 * @param  {boolean} minus Whether the cursor should be moved to the left or not.
 */
  updateCaretPos(length: number, minus = false) {
    const newCaretPos = this.updateCaretPosAction(length, minus);
    this.setCaretPosition(newCaretPos);
    //this.dispatch((instance: any) => {
    //  instance.setCaretPosition(newCaretPos);
    //});
  }

  /**
   * Action method of updateCaretPos
   *
   * @param  {number} length Represents by how many characters the input should be moved
   * @param  {boolean} minus Whether the cursor should be moved to the left or not.
   */
  updateCaretPosAction(length: number, minus = false) {
    const options = this.getOptions();
    let caretPosition = this.getCaretPosition();

    if (caretPosition != null) {
      if (minus) {
        if (caretPosition > 0) caretPosition = caretPosition - length;
      } else {
        caretPosition = caretPosition + length;
      }
    }

    if (options.debug) {
      console.log("Caret at 3:", caretPosition);
    }

    return caretPosition;
  }


  /**
   * Returns the updated input resulting from clicking a given button
   *
   * @param  {string} button The button's layout name
   * @param  {string} input The input string
   * @param  {number} caretPos The cursor's current position
   * @param  {number} caretPosEnd The cursor's current end position
   * @param  {boolean} moveCaret Whether to update simple-keyboard's cursor
   */
  getUpdatedInput(
    button: string,
    input: string,
    caretPos: any,
    caretPosEnd = caretPos,
    moveCaret = false
  ) {
    const options = this.getOptions();
    const commonParams: [number | undefined, number | undefined, boolean] = [
      caretPos,
      caretPosEnd,
      moveCaret,
    ];

    let output = input;

    if (
      (button === "{bksp}" || button === "{backspace}") &&
      output.length > 0
    ) {
      output = this.removeAt(output, ...commonParams);
    } else if (
      (button === "{delete}" || button === "{forwarddelete}") &&
      output.length > 0
    ) {
      output = this.removeForwardsAt(output, ...commonParams);
    } else if (button === "{space}")
      output = this.addStringAt(output, " ", ...commonParams);
    else if (
      button === "{tab}" &&
      !(
        typeof options.tabCharOnTab === "boolean" &&
        options.tabCharOnTab === false
      )
    ) {
      output = this.addStringAt(output, "\t", ...commonParams);
    } else if (
      (button === "{enter}" || button === "{numpadenter}") &&
      options.newLineOnEnter
    )
      output = this.addStringAt(output, "\n", ...commonParams);
    else if (
      button.includes("numpad") &&
      Number.isInteger(Number(button[button.length - 2]))
    ) {
      output = this.addStringAt(
        output,
        button[button.length - 2],
        ...commonParams
      );
    }
    else if (button === "{shift}")
    {
      if (this.isShiftOn) {
        this.isShiftOn = false;
        if (this.keyboardLayout?.default != undefined)
          this.keyboardLayout.default = this.defaultKeyboardLayout;
      }
      else {
        this.isShiftOn = true;
        if (this.keyboardLayout?.default != undefined)
          this.keyboardLayout.default = this.keyboardLayout?.shift;
      }
    }
    else if (button === "{accept}")
    {
      //When We click on 'accept' We need to capture this clicking and accept the typing...
      //if (this.options.validate != null)
      //  if (this.options.validate(this.input.value)) {
      //    if (this.options.accept != null) {
      //      this.options.accept(this.input.value);
      //    }
      //  }
      //  else {

      //  }
      if (this.keyActions.validate != undefined) {
        if (this.keyActions.validate(this.input.value)) {
          if (this.keyActions.accept != undefined) {
            this.keyActions.accept(this.input.value);
            this.textBeforeAccept = this.input.value;
          }
          else {
            this.textBeforeAccept = this.input.value;
          }
        }
        else {
          //If we failed in validation process then We need to re-back to previous text
          this.input.value = this.textBeforeAccept;
        }
      } 
      else { //If We don't declare validation then We skipping right to the accept method
        if (this.keyActions.accept != undefined) {
          this.keyActions.accept(this.input.value);
        }
        this.textBeforeAccept = this.input.value;
      }
    }
    else if (button === "{numpaddivide}")
      output = this.addStringAt(output, "/", ...commonParams);
    else if (button === "{numpadmultiply}")
      output = this.addStringAt(output, "*", ...commonParams);
    else if (button === "{numpadsubtract}")
      output = this.addStringAt(output, "-", ...commonParams);
    else if (button === "{numpadadd}")
      output = this.addStringAt(output, "+", ...commonParams);
    else if (button === "{numpaddecimal}")
      output = this.addStringAt(output, ".", ...commonParams);
    else if (button === "{" || button === "}")
      output = this.addStringAt(output, button, ...commonParams);
    else if (!button.includes("{") && !button.includes("}"))
      output = this.addStringAt(output, button, ...commonParams);

    if (options.debug) {
      console.log("Input will be: " + output);
    }

    return output;
  }
  /**
 * Gets the current value of maxLengthReached
 */
  isMaxLengthReached() {
    return Boolean(this.maxLengthReached);
  }

  /**
   * Removes an amount of characters before a given position
   *
   * @param  {string} source The source input
   * @param  {number} position The (cursor) position from where the characters should be removed
   * @param  {boolean} moveCaret Whether to update simple-keyboard's cursor
   */
  removeAt(
    source: string,
    position = source.length,
    positionEnd = source.length,
    moveCaret = false
  ) {
    if (position === 0 && positionEnd === 0) {
      return source;
    }

    let output;

    if (position === positionEnd) {
      let prevTwoChars;
      let emojiMatched;
      const emojiMatchedReg = /([\uD800-\uDBFF][\uDC00-\uDFFF])/g;

      /**
       * Emojis are made out of two characters, so we must take a custom approach to trim them.
       * For more info: https://mathiasbynens.be/notes/javascript-unicode
       */
      if (position && position >= 0) {
        prevTwoChars = source.substring(position - 2, position);
        emojiMatched = prevTwoChars.match(emojiMatchedReg);

        if (emojiMatched) {
          output = source.substr(0, position - 2) + source.substr(position);
          if (moveCaret) this.updateCaretPos(2, true);
        } else {
          output = source.substr(0, position - 1) + source.substr(position);
          if (moveCaret) this.updateCaretPos(1, true);
        }
      } else {
        prevTwoChars = source.slice(-2);
        emojiMatched = prevTwoChars.match(emojiMatchedReg);

        if (emojiMatched) {
          output = source.slice(0, -2);
          if (moveCaret) this.updateCaretPos(2, true);
        } else {
          output = source.slice(0, -1);
          if (moveCaret) this.updateCaretPos(1, true);
        }
      }
    } else {
      output = source.slice(0, position) + source.slice(positionEnd);
      if (moveCaret) {
        //this.dispatch((instance: any) => {
        this.setCaretPosition(position);
        //});
      }
    }

    return output;
  }

  /**
   * Removes an amount of characters after a given position
   *
   * @param  {string} source The source input
   * @param  {number} position The (cursor) position from where the characters should be removed
   */
  removeForwardsAt(
    source: string,
    position: number = source.length,
    positionEnd: number = source.length,
    moveCaret = false
  ) {
    if (!source?.length || position === null) {
      return source;
    }

    let output;

    if (position === positionEnd) {
      const emojiMatchedReg = /([\uD800-\uDBFF][\uDC00-\uDFFF])/g;

      /**
       * Emojis are made out of two characters, so we must take a custom approach to trim them.
       * For more info: https://mathiasbynens.be/notes/javascript-unicode
       */
      const nextTwoChars = source.substring(position, position + 2);
      const emojiMatched = nextTwoChars.match(emojiMatchedReg);

      if (emojiMatched) {
        output = source.substr(0, position) + source.substr(position + 2);
      } else {
        output = source.substr(0, position) + source.substr(position + 1);
      }
    } else {
      output = source.slice(0, position) + source.slice(positionEnd);
      if (moveCaret) {
        //this.dispatch((instance: any) => {
        this.setCaretPosition(position);
        //});
      }
    }

    return output;
  }


  /**
   * Set the keyboard’s input.
   * @param  {string} input the input value
   * @param  {string} inputName optional - the internal input to select
   */
  setInput(input_value: string,
    skipSync?: boolean): void {
    this.input.value = input_value;
  }
  /**
 * Send a command to all simple-keyboard instances (if you have several instances).
 */
  syncInstanceInputs(): void {
    //this.dispatch((instance: SimpleKeyboard) => {
    //this.replaceInput(this.input);
    this.setCaretPosition(this.caretPosition, this.caretPositionEnd);
    //});
  }
  /**
 * Check whether the button is a standard button
 */
  isStandardButton = (button: string) =>
    button && !(button[0] === "{" && button[button.length - 1] === "}");

  /**
   * Changes the internal caret position
   * @param {number} position The caret's start position
   * @param {number} positionEnd The caret's end position
   */
  setCaretPosition(position: number | null, endPosition = position): void {
    this.caretPosition = position;
    this.caretPositionEnd = endPosition;
    console.warn('caretPosition:' + this.caretPosition + ',caretPositionEnd:' + this.caretPositionEnd);
  }



  onClick(event: Event, button: string) {

    const buttonDOM = event.target as HTMLButtonElement;
    //this.input.focus();
    this.handleButtonClicked(buttonDOM, event);
    this._setCaretPosition(this.getCaretPosition());

  }

  setCurrent() {
    //var kbcss = $keyboard.css,
    //  // close any "isCurrent" keyboard (just in case they are always open)
    //  $current = $('.' + kbcss.isCurrent),
    //  kb = $current.data('keyboard');
    //// close keyboard, if not self
    //if (!$.isEmptyObject(kb) && kb.el !== base.el) {
    //  kb.close(kb.options.autoAccept ? 'true' : false);
    //}
    //$current.removeClass(kbcss.isCurrent);
    //// ui-keyboard-has-focus is applied in case multiple keyboards have
    //// alwaysOpen = true and are stacked
    //$('.' + kbcss.hasFocus).removeClass(kbcss.hasFocus);

    //base.$el.addClass(kbcss.isCurrent);
    //base.$preview.focus();
    //base.$keyboard.addClass(kbcss.hasFocus);
    //base.isCurrent(true);
    //base.isOpen = true;
  }



  /**
   * Handles clicks made to keyboard buttons
   * @param  {string} button The button's layout name.
   */
  handleButtonClicked(button: HTMLButtonElement, e?: KeyboardHandlerEvent): void {
    const { inputName = this.defaultName, debug } = this.options;

    let button_value: string = '';
    let temp: string | null = button.getAttribute('data-skbtn');
    //alert('temp:' + temp);
    if (temp !== null)
      button_value = temp;


    /**
     * Ignoring placeholder buttons
     */
    if (button_value === "{//}") return;

    /**
     * Calculating new input
     */
    const updatedInput = this.getUpdatedInput(
      button_value,
      this.input.value,
      this.caretPosition,
      this.caretPositionEnd
    );

    /**
     * EDGE CASE: Check for whole input selection changes that will yield same updatedInput
     */
    if (this.isStandardButton(button_value) && this.activeInputElement) {
      const isEntireInputSelection =
        this.input &&
        this.input.value === updatedInput &&
        this.caretPosition === 0 &&
        this.caretPositionEnd === updatedInput.length;

      if (isEntireInputSelection) {
        this.setInput("", true);
        this.setCaretPosition(0);
        this.activeInputElement.value = "";
        this.activeInputElement.setSelectionRange(0, 0);
        this.handleButtonClicked(button, e);
        return;
      }
    }

    /**
     * Calling onKeyPress
     */
    if (typeof this.options.onKeyPress === "function") {
      //We can define in option function pointer that execute when we press on button, For all buttons...
      //(don't forget that this "handelButtonClicked" also execute)
      //this.options.onKeyPress(button, e);
    }

    if (
      // If input will change as a result of this button press
      this.input.value !== updatedInput &&
      // This pertains to the "inputPattern" option:
      // If inputPattern isn't set
      (!this.options.inputPattern ||
        // Or, if it is set and if the pattern is valid - we proceed.
        (this.options.inputPattern && this.inputPatternIsValid(updatedInput)))
    ) {
      /**
       * If maxLength and handleMaxLength yield true, halting
       */
      if (
        this.options.maxLength &&
        this.handleMaxLength(updatedInput)
      ) {
        return;
      }

      /**
       * Updating input
       */
      const newInputValue = this.getUpdatedInput(
        button_value,
        this.input.value,
        this.caretPosition,
        this.caretPositionEnd,
        true
      );

      this.setInput(newInputValue, true);

      //if (debug) console.log("Input changed:", this.getAllInputs());


      //this._setCaretPosition(this.getCaretPosition() as number);

      if (this.options.debug) {
        console.log(
          "Caret at 2: ",
          this.getCaretPosition(),
          this.getCaretPositionEnd(),
          `(xxx)`,
          e?.type
        );
      }

      /**
       * Enforce syncInstanceInputs, if set
       */
      if (this.options.syncInstanceInputs) this.syncInstanceInputs();

      /**
       * Calling onChange
       */
      if (typeof this.options.onChange === "function")
        this.options.onChange(this.getInput(this.options.inputName, true), e);

      /**
       * Calling onChangeAll
       */
      //if (typeof this.options.onChangeAll === "function")
      //  this.options.onChangeAll(this.getAllInputs(), e);

      /**
       * Check if this new input has candidates (suggested words)
       */
      // https://hodgef.com/simple-keyboard/documentation/options/layoutcandidates/
      //  if (e?.target && this.options.enableLayoutCandidates) {
      //    const { candidateKey, candidateValue } =
      //      this.getInputCandidates(updatedInput);

      //    if (candidateKey && candidateValue) {
      //      this.showCandidatesBox(
      //        candidateKey,
      //        candidateValue,
      //        this.keyboardDOM
      //      );
      //    } else {
      //      this.candidateBox?.destroy();
      //    }
      //  }
      //}

      /**
       * After a button is clicked the selection (if any) will disappear
       * we should reflect this in our state, as applicable
       */
      console.warn('1:');
      if (this.caretPositionEnd && this.caretPosition !== this.caretPositionEnd) {
        this.setCaretPosition(this.caretPositionEnd, this.caretPositionEnd);
        console.warn('2:');
        if (this.input) {
          this.input.setSelectionRange(this.caretPositionEnd, this.caretPositionEnd);
          console.warn('3:');
        }

        if (this.options.debug) {
          console.log("Caret position aligned", this.caretPosition);
        }
      }

      if (debug) {
        console.log("Key pressed:", button);
      }
    }

  }


  _setCaretPosition(position: number | null) {
    // Modern browsers
    //alert(position);
    //if (position == null) {
    //  this.input.focus();
    //  this.input.setSelectionRange(1, 1);
    //  alert(position);
    //}
    //else {
    //  this.input.focus();
    //  this.input.setSelectionRange(position, position);
    //}


    this.input.focus();
    this.input.setSelectionRange(position, position);

    // IE8 and below
    //} else if (ctrl.createTextRange) {
    //  var range = ctrl.createTextRange();
    //  range.collapse(true);
    //  range.moveEnd('character', pos);
    //  range.moveStart('character', pos);
    //  range.select();
    //}
  }



  /**
   * Called by {@link setEventListeners} when an event that warrants a cursor position update is triggered
   */
  caretEventHandler(event: KeyboardHandlerEvent): void {
    //let targetTagName: string;
    //if (event.target.tagName) {
    //  targetTagName = event.target.tagName.toLowerCase();
    //}

    //this.dispatch((instance) => {
    //let isKeyboard =
    //  event.target === instance.keyboardDOM ||
    //  (event.target && instance.keyboardDOM.contains(event.target));

    /**
     * If syncInstanceInputs option is enabled, make isKeyboard match any instance
     * not just the current one
     */
    //if (this.options.syncInstanceInputs && Array.isArray(event.path)) {
    //  isKeyboard = event.path.some((item: HTMLElement) =>
    //    item?.hasAttribute?.("data-skInstance")
    //  );
    //}

    //if (
    //  (targetTagName === "textarea" ||
    //    (targetTagName === "input" &&
    //      ["text", "search", "url", "tel", "password"].includes(
    //        event.target.type
    //      ))) &&
    //  !instance.options.disableCaretPositioning
    //) {
    /**
     * Tracks current cursor position
     * As keys are pressed, text will be added/removed at that position within the input.
     */
    let selectionStart = this.input.selectionStart;
    let selectionEnd = this.input.selectionEnd;

    if (this.options.rtl) {
      selectionStart = this.getRtlOffset(selectionStart as number, this.getInput());
      selectionEnd = this.getRtlOffset(selectionEnd as number, this.getInput());
    }

    this.setCaretPosition(selectionStart, selectionEnd);

    /**
     * Tracking current input in order to handle caret positioning edge cases
     */
    this.activeInputElement = this.input;

    if (this.options.debug) {
      console.log(
        "Caret at 1: ",
        this.getCaretPosition(),
        this.getCaretPositionEnd(),
        event && event.target.tagName.toLowerCase(),
        `()`,
        event?.type
      );
    }
    //}
    //else if (
    //  (instance.options.disableCaretPositioning || !isKeyboard) &&
    //  event?.type !== "selectionchange"
    //) {
    //  /**
    //   * If we toggled off disableCaretPositioning, we must ensure caretPosition doesn't persist once reactivated.
    //   */
    //  instance.setCaretPosition(null);

    //  /**
    //   * Resetting activeInputElement
    //   */
    //  this.activeInputElement = null;

    //  if (instance.options.debug) {
    //    console.log(
    //      `Caret position reset due to "${event?.type}" event`,
    //      event
    //    );
    //  }
    //}
    //});
    ////
  }

  /**
   * This handles the "inputPattern" option
   * by checking if the provided inputPattern passes
   */
  inputPatternIsValid(inputVal: string): boolean {
    const inputPatternRaw = this.options.inputPattern;
    let inputPattern;

    /**
     * Check if input pattern is global or targeted to individual inputs
     */
    if (inputPatternRaw instanceof RegExp) {
      inputPattern = inputPatternRaw;
    } else {
      inputPattern =
        inputPatternRaw[this.options.inputName || this.defaultName];
    }

    if (inputPattern && inputVal) {
      const didInputMatch = inputPattern.test(inputVal);

      if (this.options.debug) {
        console.log(
          `inputPattern ("${inputPattern}"): ${didInputMatch ? "passed" : "did not pass!"
          }`
        );
      }

      return didInputMatch;
    } else {
      /**
       * inputPattern doesn't seem to be set for the current input, or input is empty. Pass.
       */
      return true;
    }
  }

  /**
   * Get the keyboard’s input (You can also get it from the onChange prop).
   * @param  {string} [inputName] optional - the internal input to select
   */
  getInput(
    inputName: string = this.options.inputName || this.defaultName,
    skipSync = false
  ): string {
    /**
     * Enforce syncInstanceInputs, if set
     */
    //    if (this.options.syncInstanceInputs && !skipSync) this.syncInstanceInputs();

    if (this.options.rtl) {
      // Remove existing control chars
      const inputWithoutRTLControl = this.input.value
        .replace("\u202B", "")
        .replace("\u202C", "");

      return "\u202B" + inputWithoutRTLControl + "\u202C";
    } else {
      return this.input.value;
    }
  }


  /**
 * Send a command to all simple-keyboard instances at once (if you have multiple instances).
 * @param  {function(instance: object, key: string)} callback Function to run on every instance
 */
  // eslint-disable-next-line no-unused-vars
  dispatch(callback: (instance: this, key?: string) => void): void {

    alert('dispatch');
  }


  /**
   * Handles simple-keyboard event listeners
   */
  setEventListeners(): void {
    /**
     * Only first instance should set the event listeners
     */
    //if (this.isFirstKeyboardInstance || !this.allKeyboardInstances) {

    const { physicalKeyboardHighlightPreventDefault = false } = this.options;

    /**
     * Event Listeners
     */
    this.input.addEventListener("keyup", this.handleKeyUp, physicalKeyboardHighlightPreventDefault);
    this.input.addEventListener("keydown", this.handleKeyDown, physicalKeyboardHighlightPreventDefault);
    this.input.addEventListener("mouseup", this.handleMouseUp);
    this.input.addEventListener("touchend", this.handleTouchEnd);
    this.input.addEventListener("selectionchange", this.handleSelectionChange);
    this.input.addEventListener("select", this.handleSelect);

  }

  /**
   * Event Handler: KeyUp
   */
  handleKeyUp(event: KeyboardHandlerEvent): void {
    //alert('handleKeyUp');
    this.input.focus();
    this.caretEventHandler(event);

    if (this.options.physicalKeyboardHighlight) {
      //this.physicalKeyboard.handleHighlightKeyUp(event);
    }
  }

  /**
   * Event Handler: KeyDown
   */
  handleKeyDown(event: KeyboardHandlerEvent): void {
    //alert('handleKeyDown');
    if (this.options.physicalKeyboardHighlight) {
      //this.physicalKeyboard.handleHighlightKeyDown(event);
    }
  }


  /**
   * Event Handler: MouseUp
   */
  handleFocusOut(event: KeyboardHandlerEvent): void {
    //When We finish focus on the input text, We need to check if the text we input is correct,
    //We do that by calling to validation method.

    //!!!!! there is problem, because when we focus on the input text the keyboard is come up,
    //And when We press on the keyboard the trigger 'focus out' event is lunch even we still in the text input typing process.
    //So We must to Therefore, in order to know when we are done typing, the simplest way is when you click the 'Confirm/accept' button,
    //Only then will we update the text, without that we will not update it.
    //Or in a second way, only when the user has exited the text box and also closed the keyboard, then we will activate the 'validation' function
    //if (this.options.validate != null && this.div_keyboard.nativeElement.hidden)  --> this line of code don't work well,
    //This condition be true only if focus out from the text input and also if we hide the keyboard
    //if (this.options.validate != null && this.div_keyboard.nativeElement.hidden) {
    //  this.options.validate(this.input.value);
    //}
    //else {

    //}
  }
  /**
   * Event Handler: MouseUp
   */
  handleMouseUp(event: KeyboardHandlerEvent): void {
    //When We focus on the text input We wont to show the keyboard.
    this.keyboard_css = this.css.default + ' ' + this.css.isCurrent + ' ' + this.css.hasFocus + ' ' + this.css.keyboard;
    this.keyboardEventsService.emitEvent(this);
    //this.div_keyboard.nativeElement.hidden = false;
    this.caretEventHandler(event);

    //this.div_keyboard.nativeElement.offsetLeft --> X value;
    //this.div_keyboard.nativeElement.offsetTop --> Y value;
    //this.div_keyboard.nativeElement.offsetWidth --> The Width;
    //this.div_keyboard.nativeElement.offsetHeight --> The height;


    this.keyboardPosition.top = this.div_keyboard.nativeElement.offsetTop + 5;
    this.keyboardPosition.left = this.div_keyboard.nativeElement.offsetLeft;


  }

  /**
   * Event Handler: TouchEnd
   */
  /* istanbul ignore next */
  handleTouchEnd(event: KeyboardHandlerEvent): void {
    //alert('handleTouchEnd');
    this.caretEventHandler(event);
  }

  /**
   * Event Handler: Select
   */
  /* istanbul ignore next */
  handleSelect(event: KeyboardHandlerEvent): void {
    //alert('swelect');
    this.caretEventHandler(event);
  }

  /**
   * Event Handler: SelectionChange
   */
  /* istanbul ignore next */
  handleSelectionChange(event: KeyboardHandlerEvent): void {
    //alert('handleSelectionChange');

    /**
     * Firefox is not reporting the correct caret position through this event
     * https://github.com/hodgef/simple-keyboard/issues/1839
     */
    if (navigator.userAgent.includes('Firefox')) {
      return;
    }
    this.caretEventHandler(event);
  }





	// Action key function list
	keyaction = {
    accept: function () {
      //base.close(true); // same as base.accept();
      return false; // return false prevents further processing
    },
    alt: function () {
      //base.altActive = !base.altActive;
      //base.showSet();
    },
    bksp: function () {
      //if (base.isContentEditable) {
      //  base.execCommand('delete');
      //  // save new caret position
      //  base.saveCaret();
      //} else {
      //  // the script looks for the '\b' string and initiates a backspace
      //  base.insertText('\b');
      //}
    },
    cancel: function () {
      //base.close();
      return false; // return false prevents further processing
    },
    clear: function () {
      //base.$preview[base.isContentEditable ? 'text' : 'val']('');
      //if (base.$decBtn.length) {
      //  base.checkDecimal();
      //}
    },
    combo: function () {
      //var o = base.options,
      //  c = !o.useCombos,
      //  $combo = base.$keyboard.find('.' + $keyboard.css.keyPrefix + 'combo');
      //o.useCombos = c;
      //$combo
      //  .toggleClass(o.css.buttonActive, c)
      //  // update combo key state
      //  .attr('title', $combo.attr('data-title') + ' (' + o.display[c ? 'active' : 'disabled'] + ')');
      //if (c) {
      //  base.checkCombos();
      //}
      return false;
    },
    dec: function () {
      //base.insertText((base.decimal) ? '.' : ',');
    },
    del: function () {
      //if (base.isContentEditable) {
      //  base.execCommand('forwardDelete');
      //} else {
      //  // the script looks for the '{d}' string and initiates a delete
      //  base.insertText('{d}');
      //}
    },
    // resets to base keyset (deprecated because "default" is a reserved word)
    'default': function () {
      //base.shiftActive = base.altActive = base.metaActive = false;
      //base.showSet();
    },
    // el is the pressed key (button) object; it is null when the real keyboard enter is pressed
    enter: function (/*base, el, e*/) {
      //var o = base.options;
      //// shift+enter in textareas
      //if (e.shiftKey) {
      //  // textarea, input & contenteditable - enterMod + shift + enter = accept,
      //  //  then go to prev; base.switchInput(goToNext, autoAccept)
      //  // textarea & input - shift + enter = accept (no navigation)
      //  return (o.enterNavigation) ? base.switchInput(!e[o.enterMod], true) : base.close(true);
      //}
      //// input only - enterMod + enter to navigate
      //if (o.enterNavigation && (!base.isTextArea || e[o.enterMod])) {
      //  return base.switchInput(!e[o.enterMod], o.autoAccept ? 'true' : false);
      //}
      //// pressing virtual enter button inside of a textarea - add a carriage return
      //// e.target is span when clicking on text and button at other times
      //if (base.isTextArea && $(e.target).closest('button').length) {
      //  // IE8 fix (space + \n) - fixes #71 thanks Blookie!
      //  base.insertText(($keyboard.msie ? ' ' : '') + '\n');
      //}
      //if (base.isContentEditable && !o.enterNavigation) {
      //  base.execCommand('insertHTML', '<div><br class="' + $keyboard.css.divWrapperCE + '"></div>');
      //  // Using backspace on wrapped BRs will now shift the textnode inside of the wrapped BR
      //  // Although not ideal, the caret is moved after the block - see the wiki page for
      //  // more details: https://github.com/Mottie/Keyboard/wiki/Contenteditable#limitations
      //  // move caret after a delay to allow rendering of HTML
      //  setTimeout(function () {
      //    $keyboard.keyaction.right(base);
      //    base.saveCaret();
      //  }, 0);
      //}
    },
    // caps lock key
    lock: function () {
      //base.last.keyset[0] = base.shiftActive = base.capsLock = !base.capsLock;
      //base.showSet();
    },
    left: function () {
      //var p = $keyboard.caret(base.$preview);
      //if (p.start - 1 >= 0) {
      //  // move both start and end of caret (prevents text selection) & save caret position
      //  base.last.start = base.last.end = p.start - 1;
      //  $keyboard.caret(base.$preview, base.last);
      //  base.setScroll();
      //}
    },
    meta: function (/*base, el*/) {
      //var $el = $(el);
      //base.metaActive = !$el.hasClass(base.options.css.buttonActive);
      //base.showSet($el.attr('data-name'));
    },
    next: function () {
      //base.switchInput(true, base.options.autoAccept);
      return false;
    },
    // same as 'default' - resets to base keyset
    normal: function () {
      //base.shiftActive = base.altActive = base.metaActive = false;
      //base.showSet();
    },
    prev: function () {
      //base.switchInput(false, base.options.autoAccept);
      return false;
    },
    right: function () {
      //var p = $keyboard.caret(base.$preview),
      //  len = base.isContentEditable ? $keyboard.getEditableLength(base.el) : base.getValue().length;
      //if (p.end + 1 <= len) {
      //  // move both start and end of caret to end position
      //  // (prevents text selection) && save caret position
      //  base.last.start = base.last.end = p.end + 1;
      //  $keyboard.caret(base.$preview, base.last);
      //  base.setScroll();
      //}
    },
    shift: function () {
      //base.last.keyset[0] = base.shiftActive = !base.shiftActive;
      //base.showSet();
    },
    sign: function () {
      //var signRegex = base.decimal ? /^[+-]?\d*\.?\d*$/ : /^[+-]?\d*,?\d*$/;
      //if (signRegex.test(base.getValue())) {
      //  var caret,
      //    p = $keyboard.caret(base.$preview),
      //    val = base.getValue(),
      //    len = base.isContentEditable ? $keyboard.getEditableLength(base.el) : val.length;
      //  base.setValue(val * -1);
      //  caret = len - val.length;
      //  base.last.start = p.start + caret;
      //  base.last.end = p.end + caret;
      //  $keyboard.caret(base.$preview, base.last);
      //  base.setScroll();
      //}
    },
    space: function () {
      //base.insertText(' ');
    },
    tab: function () {
      //var o = base.options;
      //if (!base.isTextArea) {
      //  if (o.tabNavigation) {
      //    return base.switchInput(!base.shiftActive, true);
      //  } else if (base.isInput) {
      //    // ignore tab key in input
      //    return false;
      //  }
      //}
      //base.insertText('\t');
    },
    toggle: function () {
      //base.enabled = !base.enabled;
      //base.toggle();
    },
    // *** Special action keys: NBSP & zero-width characters ***
    // Non-breaking space
    NBSP: '\u00a0',
    // zero width space
    ZWSP: '\u200b',
    // Zero width non-joiner
    ZWNJ: '\u200c',
    // Zero width joiner
    ZWJ: '\u200d',
    // Left-to-right Mark
    LRM: '\u200e',
    // Right-to-left Mark
    RLM: '\u200f'
  };




  /*
     Position keyboard
  */
  /* ****************************************************************
   * Position the keyboard
   *https://github.com/the-darc/angular-virtual-keyboard/blob/master/src/vki-core.js
   */
  //VKI_position(force: string) {
  //  /* ***** Build the keyboard interface ************************** */
  //  //this.VKI_keyboard = document.createElement('table');
  //  if (!self.VKI_relative) {
  //    this.div_keyboard.nativeElement.style.position
  //    this.div_keyboard.nativeElement.style.position = 'fixed';
  //    this.div_keyboard.nativeElement.style.bottom = '0px';
  //    this.div_keyboard.nativeElement.style.left = '0px';
  //    this.div_keyboard.nativeElement.style.width = '100%';
  //    return;
  //  }
  //  if (true) {
  //    var kPos = this.VKI_findPos(this.div_keyboard.nativeElement), wDim = this.VKI_innerDimensions(), sDis = this.VKI_scrollDist();
  //    var place = false, fudge = self.VKI_target.offsetHeight + 3;
  //    if (self.VKI_forcePosition === 'top') {
  //      fudge = -this.div_keyboard.nativeElement.offsetHeight - 3;
  //    }
  //    if (force !== true) {
  //      if (kPos[1] + this.div_keyboard.nativeElement.offsetHeight - sDis[1] - wDim[1] > 0 && self.VKI_forcePosition !== 'bottom') {
  //        place = true;
  //        fudge = -this.div_keyboard.nativeElement.offsetHeight - 3;
  //      } else if (kPos[1] - sDis[1] < 0) place = true;
  //    }
  //    if (place || force === true) {
  //      var iPos = this.VKI_findPos(self.VKI_target), scr = self.VKI_target;
  //      while (scr = scr.parentNode) {
  //        if (scr == document.body) break;
  //        if (scr.scrollHeight > scr.offsetHeight || scr.scrollWidth > scr.offsetWidth) {
  //          if (!scr.getAttribute("VKI_scrollListener")) {
  //            scr.setAttribute("VKI_scrollListener", true);
  //            VKI_addListener(scr, 'scroll', function () { self.VKI_position(true); }, false);
  //          } // Check if the input is in view
  //          var pPos = VKI_findPos(scr), oTop = iPos[1] - pPos[1], oLeft = iPos[0] - pPos[0];
  //          var top = oTop + self.VKI_target.offsetHeight;
  //          var left = oLeft + self.VKI_target.offsetWidth;
  //          var bottom = scr.offsetHeight - oTop - self.VKI_target.offsetHeight;
  //          var right = scr.offsetWidth - oLeft - self.VKI_target.offsetWidth;
  //          self.VKI_keyboard.style.display = (top < 0 || left < 0 || bottom < 0 || right < 0) ? "none" : "";
  //          if (self.VKI_isIE6) self.VKI_iframe.style.display = (top < 0 || left < 0 || bottom < 0 || right < 0) ? "none" : "";
  //        }
  //      }
  //      self.VKI_keyboard.style.top = iPos[1] - ((self.VKI_target.keyboardPosition == "fixed" && !self.VKI_isIE && !self.VKI_isMoz) ? sDis[1] : 0) + fudge + "px";
  //      self.VKI_keyboard.style.left = Math.max(10, Math.min(wDim[0] - self.VKI_keyboard.offsetWidth - 25, iPos[0])) + "px";
  //      if (self.VKI_isIE6) {
  //        self.VKI_iframe.style.width = self.VKI_keyboard.offsetWidth + "px";
  //        self.VKI_iframe.style.height = self.VKI_keyboard.offsetHeight + "px";
  //        self.VKI_iframe.style.top = self.VKI_keyboard.style.top;
  //        self.VKI_iframe.style.left = self.VKI_keyboard.style.left;
  //      }
  //    }
  //    if (force === true) self.VKI_position();
  //  }
  //}

  //VKI_findPos(obj: HTMLElement) {
  //  var curleft: number = 0;
  //  var curtop: number = 0;
  //  var src: ParentNode | null = obj.parentNode;
  //  while (src && src != document.body) {
  //    curleft -= (<HTMLElement>src).scrollLeft || 0;
  //    curtop -= (<HTMLElement>src).scrollTop || 0;
  //  }
  //  while (obj != (<HTMLElement>obj).offsetParent)
  //  {
  //    curleft += (<HTMLElement>obj).offsetLeft;
  //    curtop += (<HTMLElement>obj).offsetTop;
  //    obj = <HTMLElement>obj.offsetParent;
  //  } 
  //  return [curleft, curtop];
  //}

  //VKI_innerDimensions() {
  //  if (innerHeight) {
  //    return [innerWidth, innerHeight];
  //  } else if (document.documentElement && document.documentElement.clientHeight) {
  //    return [document.documentElement.clientWidth, document.documentElement.clientHeight];
  //  } else if (document.body)
  //    return [document.body.clientWidth, document.body.clientHeight];
  //  return [0, 0];
  //}

  //VKI_scrollDist() {
  //  var html = document.getElementsByTagName('html')[0];
  //  if (html.scrollTop && document.documentElement.scrollTop) {
  //    return [html.scrollLeft, html.scrollTop];
  //  } else if (html.scrollTop || document.documentElement.scrollTop) {
  //    return [html.scrollLeft + document.documentElement.scrollLeft, html.scrollTop + document.documentElement.scrollTop];
  //  } else if (document.body.scrollTop)
  //    return [document.body.scrollLeft, document.body.scrollTop];
  //  return [0, 0];
  //}


  /**
   * Physical Keyboard Service
   */



}
