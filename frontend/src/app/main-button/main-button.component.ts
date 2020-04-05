import { Component, OnInit } from '@angular/core';
import { ButtonPosition, ButtonState, ButtonEvent, ButtonEventType } from './button';
import { MainButtonService } from './main-button.service';

@Component({
  selector: 'app-main-button',
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

  verticalTransition: boolean = false;
  horizontalTransition: boolean = false;

  constructor(private buttonService: MainButtonService) {
    buttonService._buttonEvents$.subscribe((event: ButtonEvent) => {
      switch (event.type) {
        case ButtonEventType.BUTTON_POSITION:
          this.setButtonPosition(event.value);
          break;
        case ButtonEventType.BUTTON_SATE:
          this.setButtonState(event.value);
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
    setTimeout(()=>{
      this.verticalTransition = false;
    }, 250);
  }
}
