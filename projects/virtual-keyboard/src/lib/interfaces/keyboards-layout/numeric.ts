import { KeyboardLayout } from "./keyboard-layout"
export const Numeric: KeyboardLayout =
{
    name: "numeric",
    lang: "num",
    default: ['7 8 9 {b}',
        '4 5 6 {empty}',
        '1 2 3 {clear}',
        '{accept} 0 {dec} {c}'],
    shift: [],
  alt: [],
  getDefaultDiplay() {
    return {
      "{empty}": " ",
      "{bksp}": "backspace",
      "{backspace}": "backspace",
      "{enter}": "< enter",
      "{alt}": "alt",
      "{s}": "shift",
      "{tab}": "tab",
      "{lock}": "caps",
      "{capslock}": "caps",
      "{accept}": "✔",
      "{space}": " ",
      "{esc}": "esc",
      "{dec}": "."
    }
  }
}

export const Numeric_Minus: KeyboardLayout =
{
  name: "numeric",
  lang: "num_minus",
  default: ['7 8 9 {bksp}',
    '4 5 6 -',
    '1 2 3 {clear}',
    '{accept} 0 {dec} {c}'],
  shift: [],
  alt: [],
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
      "{accept}": "✔",
      "{space}": " ",
      "{//}": " ",
      "{esc}": "esc",
      "{escape}": "esc",
      "{f1}": "f1",
      "{f2}": "f2",
      "{f3}": "f3",
      "{f4}": "f4",
      "{f5}": "f5",
      "{f6}": "f6",
      "{f7}": "f7",
      "{f8}": "f8",
      "{f9}": "f9",
      "{f10}": "f10",
      "{f11}": "f11",
      "{f12}": "f12",
      "{numpaddivide}": "/",
      "{numlock}": "lock",
      "{arrowup}": "↑",
      "{arrowleft}": "←",
      "{arrowdown}": "↓",
      "{arrowright}": "→",
      "{prtscr}": "print",
      "{scrolllock}": "scroll",
      "{pause}": "pause",
      "{insert}": "ins",
      "{home}": "home",
      "{pageup}": "up",
      "{delete}": "del",
      "{forwarddelete}": "del",
      "{end}": "end",
      "{pagedown}": "down",
      "{numpadmultiply}": "*",
      "{numpadsubtract}": "-",
      "{numpadadd}": "+",
      "{numpadenter}": "enter",
      "{period}": ".",
      "{numpaddecimal}": ".",
      "{numpad0}": "0",
      "{numpad1}": "1",
      "{numpad2}": "2",
      "{numpad3}": "3",
      "{numpad4}": "4",
      "{numpad5}": "5",
      "{numpad6}": "6",
      "{numpad7}": "7",
      "{numpad8}": "8",
      "{numpad9}": "9",
    }
  }
}
