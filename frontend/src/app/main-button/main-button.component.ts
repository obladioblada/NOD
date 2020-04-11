import { Component, OnInit } from '@angular/core';
import { ButtonPosition, ButtonState, ButtonEvent, ButtonEventType } from './button';
import { MainButtonService } from './main-button.service';
import { BuiltinFunctionCall } from '@angular/compiler/src/compiler_util/expression_converter';

@Component({
  selector: 'nod-main-button',
  templateUrl: './main-button.component.html',
  styleUrls: ['./main-button.component.scss']
})
export class MainButtonComponent {

  ButtonPosition = ButtonPosition;
  ButtonState = ButtonState;

  state: ButtonState = ButtonState.IDLE;
  position: ButtonPosition = ButtonPosition.CENTER;
  callback: Function;
  callbackParameters: any;

  verticalTransition = false;
  horizontalTransition = false;

  constructor(mainButtonService: MainButtonService) {
    mainButtonService._buttonEvents$.subscribe((event: ButtonEvent) => {
      switch (event.type) {
        case ButtonEventType.BUTTON_POSITION:
          this.setButtonPosition(event.value);
          break;
        case ButtonEventType.BUTTON_SATE:
          this.setButtonState(event.value);
          break;
        case ButtonEventType.BUTTON_CALLBACK:
          this.setButtonCallBack(event.callback);
          break;
      }
    });
  }

  toIDLE() {
    this.state = ButtonState.IDLE;
  }
  toLOADING() {
    this.state = ButtonState.LOADING;
  }
  toSUCCESS() {
    this.state = ButtonState.SUCCESS;
  }
  toERROR() {
    this.state = ButtonState.ERROR;
  }

  setButtonState(buttonState: ButtonState) {
    this.state = buttonState;
  }

  setButtonPosition(buttonPosition: ButtonPosition) {
    this.position = buttonPosition;
    this.verticalTransition = true;
    setTimeout(() => {
      this.verticalTransition = false;
    }, 300);
  }

  setButtonCallBack(buttonCallback: Function) {
    this.callback = buttonCallback;
  }
}
