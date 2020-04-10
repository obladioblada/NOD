import { Injectable } from '@angular/core';
import {
  ButtonState,
  ButtonPosition,
  ButtonEvent,
  ButtonEventType
} from './button';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MainButtonService {
  private _buttonEvents = new Subject();
  _buttonEvents$ = this._buttonEvents.asObservable();
  eventButton: ButtonEvent;

  setButtonState(buttonState: ButtonState) {
    this.eventButton = {
      type: ButtonEventType.BUTTON_SATE,
      value: buttonState
    };
    this.next();
  }

  setButtonPosition(buttonPosition: ButtonPosition) {
    this.eventButton = {
      type: ButtonEventType.BUTTON_POSITION,
      value: buttonPosition
    };
    this.next();
  }

  setButtonCallback(buttonCallback: Function, parameters?: any) {
    this.eventButton = {
      type: ButtonEventType.BUTTON_CALLBACK,
      value: parameters,
      callback: buttonCallback
    };
    this.next();
  }

  next() {
    this._buttonEvents.next(this.eventButton);
  }
}
