// Keep shortcuts inert while typing, using modifiers, or interacting with dialogs.
export function hotkeyAction(event){
 if(event.repeat||event.ctrlKey||event.metaKey||event.altKey||event.isComposing)return null;
 if(event.target?.closest?.('input,textarea,select,[contenteditable="true"],[contenteditable=""]'))return null;
 if(event.target?.matches?.('[data-party-slot]')&&['Space','Enter'].includes(event.code))return null;
 return ({KeyN:'next',KeyA:'auto',KeyS:'speed',Space:'pause',Digit1:'card:0',Digit2:'card:1',Digit3:'card:2',Numpad1:'card:0',Numpad2:'card:1',Numpad3:'card:2',Enter:'enter'})[event.code]||null;
}
