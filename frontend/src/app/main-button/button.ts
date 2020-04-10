import { MainButtonService } from './main-button.service';
export enum ButtonState {
  IDLE = 0,
  LOADING = 1,
  SUCCESS = 2,
  ERROR = 3,
  PLAY = 4
}

export enum ButtonPosition {
  CENTER = 0,
  BOTTOM = 1
}

export enum ButtonEventType {
  BUTTON_POSITION,
  BUTTON_SATE,
  BUTTON_CALLBACK
}

export class ButtonEvent {
  type: ButtonEventType;
  value: any;
  callback?: Function;
}
