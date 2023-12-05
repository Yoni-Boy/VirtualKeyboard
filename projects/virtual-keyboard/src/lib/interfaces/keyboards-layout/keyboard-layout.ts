import { Hebrew } from "./hebrew";
import { English } from "./english";
import { Emoji } from "./emoji";
import { Numeric, Numeric_Minus } from "./numeric";

export interface KeyboardLayout {
  lang: string;
  name: string;
  default: string[];
  shift: string[];
  alt: string[];
  getDefaultDiplay(): { [button: string]: string };
}
//This variable contain the all keyboard layouts language 
export const AllKeyboardsLayout = new Map<string, KeyboardLayout>([[Hebrew.lang, Hebrew],
  [English.lang, English],
  [Emoji.lang,Emoji],
  [Numeric.lang, Numeric],
  [Numeric_Minus.lang, Numeric_Minus]]);
//This method get language and return KeyboardLayout
export const getKeyboardLayout = (lang: string): KeyboardLayout | undefined => {
  var keyboardLayout: KeyboardLayout | undefined;
  keyboardLayout = AllKeyboardsLayout.get(lang);
  if (keyboardLayout == undefined) {
    keyboardLayout = AllKeyboardsLayout.get("en");
  }
  return keyboardLayout;
};

/**
 * Default button display labels
 * This method We declare in English/Hebrew layout, because for each specific keyboard layout there is unique declarations
 * For example for Hebrew layout We declare the space like this: "{space}": "רווח"  
 */
  //export const getDefaultDiplay = () => {
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


